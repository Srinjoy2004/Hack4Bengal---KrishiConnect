import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Web Speech API type definitions
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudioend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

// Define message types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Define suggestion types
interface Suggestion {
  id: string;
  text: string;
}

// Language-specific suggestions
const farmingSuggestions: Record<string, Suggestion[]> = {
  en: [
    { id: '1', text: 'Weather forecast for my crops' },
    { id: '2', text: 'Best practices for organic farming' },
    { id: '3', text: 'How to identify plant diseases' },
    { id: '4', text: 'Soil testing recommendations' },
    { id: '5', text: 'Water conservation techniques' },
  ],
  bn: [
    { id: '1', text: 'আমার ফসলের জন্য আবহাওয়ার পূর্বাভাস' },
    { id: '2', text: 'জৈব চাষের সেরা পদ্ধতি' },
    { id: '3', text: 'উদ্ভিদের রোগ কীভাবে চিহ্নিত করব' },
    { id: '4', text: 'মাটি পরীক্ষার পরামর্শ' },
    { id: '5', text: 'জল সংরক্ষণের কৌশল' },
  ],
  hi: [
    { id: '1', text: 'मेरी फसलों के लिए मौसम पूर्वानुमान' },
    { id: '2', text: 'जैविक खेती के लिए सर्वोत्तम अभ्यास' },
    { id: '3', text: 'पौधों की बीमारियों की पहचान कैसे करें' },
    { id: '4', text: 'मिट्टी परीक्षण की सिफारिशें' },
    { id: '5', text: 'जल संरक्षण तकनीक' },
  ],
  ta: [
    { id: '1', text: 'எனது பயிர்களுக்கான வானிலை முன்னறிவிப்பு' },
    { id: '2', text: 'கரிம விவசாயத்திற்கான சிறந்த நடைமுறைகள்' },
    { id: '3', text: 'தாவர நோய்களை எவ்வாறு அடையாளம் காண்பது' },
    { id: '4', text: 'மண் பரிசோதனை பரிந்துரைகள்' },
    { id: '5', text: 'நீர் பாதுகா்ப்பு நுட்பங்கள்' },
  ],
  te: [
    { id: '1', text: 'నా పంటల కోసం వాతావరణ సూచన' },
    { id: '2', text: 'సేంద్రీయ వ్యవసాయం కోసం ఉత్తమ పద్ధతులు' },
    { id: '3', text: 'మొక్కల వ్యాధులను ఎలా గుర్తించాలి' },
    { id: '4', text: 'మట్టి పరీక్ష సిఫార్సులు' },
    { id: '5', text: 'నీటి సంరక్షణ టెక్నిక్‌లు' },
  ],
  mr: [
    { id: '1', text: 'माझ्या पिकांसाठी हवामान अंदाज' },
    { id: '2', text: 'सेंद्रिय शेतीसाठी सर्वोत्तम पद्धती' },
    { id: '3', text: 'वनस्पतींचे रोग कसे ओळखावे' },
    { id: '4', text: 'माती चाचणी शिफारसी' },
    { id: '5', text: 'पाणी संवर्धन तंत्र' },
  ],
};

// Language-specific placeholders
const placeholders: Record<string, string> = {
  en: 'Ask about crops, weather, or farming techniques...',
  bn: 'ফসল, আবহাওয়া, বা চাষের কৌশল সম্পর্কে জিজ্ঞাসা করুন...',
  hi: 'फसल, मौसम, या खेती की तकनीकों के बारे में पूछें...',
  ta: 'பயிர்கள், வானிலை, அல்லது விவசாய நுட்பங்கள் பற்றி கேளுங்கள்...',
  te: 'పంటలు, వాతావరణం, లేదా వ్యవసాయ టెక్నిక్‌ల గురించి అడగండి...',
  mr: 'पिके, हवामान, किंवा शेती तंत्रांबद्दल विचारा...',
};

// Language-specific welcome messages
const welcomeMessages: Record<string, string> = {
  en: "Hello, I'm **KrishiBot**, your agriculture assistant. How can I help with your farming needs today?",
  bn: "হ্যালো, আমি **কৃষিবট**, আপনার কৃষি সহায়ক। আজ আপনার চাষের প্রয়োজনে কীভাবে সাহায্য করতে পারি?",
  hi: "नमस्ते, मैं **कृषिबॉट** हूँ, आपका कृषि सहायक। आज मैं आपकी खेती की जरूरतों में कैसे मदद कर सकता हूँ?",
  ta: "வணக்கம், நான் **கிரிஷிபோட்**, உங்கள் விவசாய உதவியாளர். இன்று உங்கள் விவசாயத் தேவைகளுக்கு எவ்வாறு உதவ முடியும்?",
  te: "హాయ్, నేను **కృషిబాట్**, మీ వ్యవసాయ సహాయకుడు. ఈ రోజు మీ వ్యవసాయ అవసరాలకు ఎలా సహాయం చేయగలను?",
  mr: "नमस्कार, मी **कृषिबॉट**, तुमचा शेती सहाय्यक आहे. आज तुमच्या शेतीच्या गरजांसाठी मी कशी मदत करू शकतो?",
};

// Speech recognition language codes
const speechLanguageCodes: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
};

// ElevenLabs voice IDs for different languages
const elevenLabsVoices: Record<string, string> = {
  en: '9BWtsMINqrJLrRacOk9x', // Aria
  hi: 'pNInz6obpgDQGcFmaJgB', // Adam (multilingual)
  bn: 'EXAVITQu4vr4xnSDxMaL', // Sarah (multilingual)
};

export default function AgriSmartAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: welcomeMessages['en'],
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [useElevenLabs, setUseElevenLabs] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (SpeechRecognitionClass) {
        recognitionRef.current = new SpeechRecognitionClass();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice input received:', transcript);
          setInputValue(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: welcomeMessages[language] || welcomeMessages['en'],
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
  }, [language]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update speech recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = speechLanguageCodes[language] || 'en-IN';
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to speak text using ElevenLabs API
  const speakWithElevenLabs = async (text: string) => {
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not provided');
      return;
    }

    try {
      setIsSpeaking(true);
      const voiceId = elevenLabsVoices[language] || elevenLabsVoices['en'];
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      setIsSpeaking(false);
      // Fallback to browser TTS
      speakWithBrowserTTS(text);
    }
  };

  // Function to speak text using Web Speech API with enhanced language support
  const speakWithBrowserTTS = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced language mapping for better voice selection
    const voiceLangMap: Record<string, string[]> = {
      en: ['en-IN', 'en-US', 'en-GB'],
      hi: ['hi-IN', 'hi'],
      bn: ['bn-IN', 'bn-BD', 'bn'],
      ta: ['ta-IN', 'ta'],
      te: ['te-IN', 'te'],
      mr: ['mr-IN', 'mr'],
    };

    // Wait for voices to load
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredLangs = voiceLangMap[language] || ['en-IN'];
      
      let selectedVoice = null;
      
      // Try to find the best voice for the current language
      for (const lang of preferredLangs) {
        selectedVoice = voices.find(voice => voice.lang === lang);
        if (selectedVoice) break;
        
        // Try partial matches
        selectedVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
        if (selectedVoice) break;
      }
      
      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Selected voice:', selectedVoice.name, selectedVoice.lang);
      }

      // Adjust speech parameters based on language
      utterance.rate = language === 'hi' || language === 'bn' ? 0.8 : 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        console.log('Speech synthesis started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech synthesis ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    // Handle voice loading
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      setVoiceAndSpeak();
    }
  };

  // Function to speak text
  const speakText = (text: string) => {
    if (!voiceEnabled) return;

    // Remove markdown formatting for speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/_(.*?)_/g, '$1')       // Remove underscore italic
      .replace(/`(.*?)`/g, '$1')       // Remove code markdown
      .replace(/#+\s*/g, '')           // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links

    if (useElevenLabs && elevenLabsApiKey) {
      speakWithElevenLabs(cleanText);
    } else {
      speakWithBrowserTTS(cleanText);
    }
  };

  // Function to start voice input
  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  // Function to stop voice input
  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Function to toggle voice output
  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  // Function to check if query is agriculture-related
  const isAgricultureRelated = (input: string): boolean => {
    const keywords = [
      // English
      'crop', 'farm', 'agriculture', 'soil', 'pest', 'disease', 'irrigation', 'weather', 'organic',
      'livestock', 'cultivation', 'fertilizer', 'equipment', 'government scheme', 'farming', 'plant',
      'harvest', 'drought', 'compost', 'tractor', 'seeds', 'sowing', 'plowing', 'manure', 'cattle', 'poultry',
      // Bengali
      'ফসল', 'চাষ', 'কৃষি', 'মাটি', 'পোকা', 'রোগ', 'সেচ', 'আবহাওয়া', 'জৈব', 'গবাদি পশু', 'চাষাবাদ',
      'সার', 'সরঞ্জাম', 'সরকারি প্রকল্প', 'উদ্ভিদ', 'ফসল কাটা', 'খরা', 'কম্পোস্ট', 'ট্রাক্টর', 'বীজ', 'বপন',
      'চাষ', 'গোবর', 'গবাদি', 'মুরগি',
      // Hindi
      'फसल', 'खेती', 'कृषि', 'मिट्टी', 'कीट', 'रोग', 'सिंचाई', 'मौसम', 'जैविक', 'पशुधन', 'खेतीबाड़ी',
      'उर्वरक', 'उपकरण', 'सरकारी योजना', 'पौधा', 'कटाई', 'सूखा', 'खाद', 'ट्रैक्टर', 'बीज', 'बुवाई',
      'जुताई', 'गोबर', 'मवेशी', 'मुर्गी',
      // Tamil
      'பயிர்', 'விவசாயம்', 'மண்', 'பூச்சி', 'நோய்', 'பாசனம்', 'வானிலை', 'கரிம', 'கால்நடை', 'பயிரிடுதல்',
      'உரம்', 'உபகரணங்கள்', 'அரசு திட்டம்', 'தாவரம்', 'அறுவடை', 'வறட்சி', 'உரம்', 'டிராக்டர்', 'விதைகள்',
      'விதைப்பு', 'உழவு', 'எரு', 'கால்நடைகள்', 'கோழி',
      // Telugu
      'పంట', 'వ్యవసాయం', 'మట్టి', 'పురుగు', 'వ్యాధి', 'నీటిపారుదల', 'వాతావరణం', 'సేంద్రీయ', 'పశుసంపద',
      'సాగు', 'ఎరువు', 'సామగ్రి', 'ప్రభుత్వ పథకం', 'మొక్క', 'కోత', 'కరువు', 'కంపోస్ట్', 'ట్రాక్టర్', 'విత్తనాలు',
      'విత్తనం', 'దున్నడం', 'ఎరువు', 'పశువులు', 'కోళ్లు',
      // Marathi
      'पीक', 'शेती', 'कृषी', 'माती', 'कीटक', 'रोग', 'सिंचन', 'हवामान', 'सेंद्रिय', 'पशुधन', 'शेतीपद्धती',
      'खत', 'साधने', 'सरकारी योजना', 'वनस्पती', 'कापणी', 'दुष्काळ', 'कंपोस्ट', 'ट्रॅक्टर', 'बियाणे', 'पेरणी',
      'नांगरणी', 'शेण', 'गुरे', 'कुकुटपालन',
    ];
    return keywords.some((keyword) => input.toLowerCase().includes(keyword));
  };

  // Function to generate response using Gemini API
  const generateResponse = async (input: string): Promise<string> => {
    if (!isAgricultureRelated(input)) {
      const errorMessages: Record<string, string> = {
        en: "I'm here to assist only with agriculture-related questions. Please ask something related to farming or agriculture.",
        bn: 'আমি শুধুমাত্র কৃষি সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। দয়া করে চাষ বা কৃষি সম্পর্কিত কিছু জিজ্ঞাসা করুন।',
        hi: 'मैं केवल कृषि से संबंधित सवालों का जवाब दे सकता हूँ। कृपया खेती या कृषि से संबंधित कुछ पूछें।',
        ta: 'நான் விவசாயம் தொடர்பான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும். தயவுசெய்து விவசாயம் அல்லது பயிரிடுதல் தொடர்பானவற்றைக் கேளுங்கள்.',
        te: 'నేను వ్యవసాయ సంబంధిత ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వగలను. దయచేసి వ్యవసాయం లేదా కృషి గురించి ఏదైనా అడగండి.',
        mr: 'मी फक्त शेतीशी संबंधित प्रश्नांची उत्तरे देऊ शकतो. कृपया शेती किंवा कृषीशी संबंधित काहीतरी विचारा.',
      };
      return errorMessages[language] || errorMessages['en'];
    }

    const languageMap: Record<string, string> = {
      en: 'English',
      bn: 'Bengali',
      hi: 'Hindi',
      ta: 'Tamil',
      te: 'Telugu',
      mr: 'Marathi',
    };

    const languageName = languageMap[language] || 'English';

    const customPrompt = `You are KrishiBot, a smart, multilingual farming assistant integrated into the AgriSmart.Ai platform.  
Your purpose is to help Indian farmers—especially small and marginal ones—by providing real-time, useful, and easy-to-understand agricultural guidance.

You are trained to respond accurately to all farming-related questions. You must **always answer** questions related to:

- **Crops and growing conditions**
- **Soil fertility and moisture**
- **Fertilizers, irrigation, and pest control**
- **Weather-aware farming**
- **Livestock and equipment**
- **Government schemes and seasonal advice**

You must reply in **${languageName}**, using **simple, farmer-friendly language**.

============================================================
🌱 You MUST Answer All Crop-Related Questions, Even Informal:
============================================================

You must NEVER reject valid crop-related questions, even if the word "crop" or "plant" is missing.

For example, all of the following are valid and must be answered:

- "What is the ideal condition to grow potato?"
- "How much water does banana need?"
- "Fertilizer for chickpea?"
- "Best soil for mungbean?"

You must recognize crop names directly (e.g., "potato", "rice", "grapes", "banana")  
— even if used without the words "crop" or "plant".


====================================================================
🌾 These are priority crops. You must answer ALL questions about them:
====================================================================

- **rice**
- **maize**
- **chickpea**
- **kidney beans**
- **pigeon peas**
- **moth beans**
- **mung bean**
- **black gram**
- **lentil**
- **pomegranate**
- **banana**
- **mango**
- **grapes**
- **watermelon**
- **muskmelon**
- **apple**
- **orange**
- **papaya**
- **coconut**
- **cotton**
- **jute**
- **coffee**

For each of these crops, you must know and respond with:

- **Ideal soil moisture** (from the provided dataset)
- **Soil type, pH, and fertility needs**
- **Temperature and rainfall required**
- **Sowing and harvesting time**
- **Pest and disease risks**
- **Fertilizer type and irrigation method**

====================================================================
🎯 Core Capabilities (ALWAYS Respond to These):
====================================================================

- **Ideal growing conditions for any crop above**
- **Moisture requirements** for crops using internal lookup (e.g., rice: 30%)
- **Soil fertility improvement** with organic and inorganic practices
- **Fertilizer recommendations**: quantity, schedule, and method
- **Irrigation timing and automation support**
- **Weather-based tips** for harvest, spraying, or disease prevention
- **AI-based disease detection** (when image is uploaded)
- **Subsidy and scheme information** relevant to crops or regions
- **Livestock care** and feeding schedules
- **Farm machinery tips** for irrigation, spraying, etc.
- **Voice/text interaction** in local languages

====================================================================
⛔ Do NOT Reject the Following:
====================================================================

You must NEVER reject questions about any of the above 23 crops. For example:

- "What is the ideal moisture level for banana?"
- "How much water does cotton need?"
- "Best soil for growing chickpeas?"
- "When should I plant papaya?"
- "Fertilizer for lentil?"

These are valid and must be answered in full.

Only reject unrelated topics (politics, entertainment, finance, etc.).  
In those cases, say:

"আমি কেবলমাত্র কৃষি এবং খামার সম্পর্কিত তথ্য দিতে পারি। দয়া করে কৃষি সংক্রান্ত প্রশ্ন করুন।"

====================================================================
📝 Response Formatting Rules:
====================================================================

- Use **bold** for important terms and actionable advice
- Use *italics* for additional suggestions or notes
- Use bullet points for lists
- Use numbers for farming procedures
- Always answer in **${languageName}** using **village-friendly, simple language**
User query: ${input}`;

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDD8QW1BggDVVMLteDygHCHrD6Ff9Dy0e8',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: customPrompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        (language === 'bn'
          ? 'দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করতে পারিনি। আবার চেষ্টা করুন।'
          : language === 'hi'
          ? 'क्षमा करें, मैं आपके अनुरोध को संसाধित नहीं कर सका। कृपया पुनः प्रयास करें।'
          : language === 'ta'
          ? 'மன்னிக்கவும், உங்கள் கோரிக்கையை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
          : language === 'te'
          ? 'క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను. మళ్లీ ప్రయత్నించండి.'
          : language === 'mr'
          ? 'क्षमस्व, मी तुमची विनंती प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.'
          : 'Sorry, I could not process your request. Please try again.');
      return generatedText.trim();
    } catch (error) {
      console.error('API Error:', error);
      const errorMessages: Record<string, string> = {
        en: 'Sorry, there was an issue connecting to the server. Please try again later.',
        bn: 'দুঃখিত, সার্ভারের সাথে সংযোগে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।',
        hi: 'क्षमा करें, सर्वर से कनेक्ट करने में समस्या हुई। कृपया बाद में पुनः प्रयास करें।',
        ta: 'மன்னிக்கவும், சேவையகத்துடன் இணைப்பதில் சிக்கல் ஏற்பட்டது. பின்னர் மீண்டும் முயற்சிக்கவும்.',
        te: 'క్షమించండి, సర్వర్‌కు కనెక్ట్ చేయడంలో సమస్య ఉంది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.',
        mr: 'क्षमस्व, सर्व्हरशी कनेक्ट करण्यात अडचण आली. कृपया नंतर पुन्हा प्रयत्न करा.',
      };
      return errorMessages[language] || errorMessages['en'];
    }
  };

  // Function to handle sending messages
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate AI response
    const response = await generateResponse(text);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);

    // Speak the response if voice output is enabled
    if (voiceEnabled) {
      speakText(response);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-500 text-white px-5 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
            <path d="M16.5 3.5c1.5 1.5 1.5 4.5 0 6S13 6.5 13 5s2-3 3.5-1.5z" />
          </svg>
          <span className="font-bold text-lg">KrishiBot AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-white text-green-700 border border-green-200 rounded-md px-2 py-1 text-xs focus:outline-none shadow-sm"
          >
            <option value="en">EN</option>
            <option value="bn">BN</option>
            <option value="hi">HI</option>
            <option value="ta">TA</option>
            <option value="te">TE</option>
            <option value="mr">MR</option>
          </select>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-green-200 p-4">
          <h3 className="font-semibold text-green-800 mb-3">Voice Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useElevenLabs"
                checked={useElevenLabs}
                onChange={(e) => setUseElevenLabs(e.target.checked)}
                className="rounded border-green-300"
              />
              <label htmlFor="useElevenLabs" className="text-sm text-green-700">
                Use ElevenLabs for premium voice quality
              </label>
            </div>
            {useElevenLabs && (
              <div>
                <input
                  type="password"
                  placeholder="Enter ElevenLabs API Key"
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-green-600 mt-1">
                  Get your API key from elevenlabs.io for better Hindi & Bengali voice quality
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm h-full">
          <div className="px-5 py-3 border-b border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 15c-1.85 0-3.35-1.5-3.35-3.35S10.15 8.3 12 8.3s3.35 1.5 3.35 3.35-1.5 3.35-3.35 3.35" />
                <path d="M15.5 9A7.5 7.5 0 108 16.5" />
                <path d="M16 8A8 8 0 108 16" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-green-800">KrishiBot AI</h3>
              <p className="text-xs text-gray-500">
                {language === 'bn' ? 'খামার-নির্দিষ্ট পরামর্শ'
                : language === 'hi' ? 'फार्म-विशिष्ट सिफारिशें'
                : language === 'ta' ? 'பண்ணை-குறிப்பிட்ட பரிந்துரைகள்'
                : language === 'te' ? 'వ్యవసాయ-నిర్‍దిష్ట సిఫార్సులు'
                : language === 'mr' ? 'शेती-विशिष्ट शिफारसी'
                : 'Farm-specific recommendations'}
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-green-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white border border-green-100 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {message.sender === 'assistant' ? (
                      <div className="text-sm prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-green-800">{children}</strong>,
                            em: ({ children }) => <em className="italic text-green-700">{children}</em>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-green-100 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-300 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-300 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          <div className="px-4 py-3 bg-green-50 border-t border-green-100">
            <p className="text-xs text-green-700 mb-2">
              {language === 'bn' ? 'প্রস্তাবিত প্রশ্ন:'
              : language === 'hi' ? 'सुझाए गए प्रश्न:'
              : language === 'ta' ? 'பரிந்துரைக்கப்பட்ட கேள்விகள்:'
              : language === 'te' ? 'স౦చించిన ప্রశ্নলু:'
              : language === 'mr' ? 'सुचवलेले प्रश्न:'
              : 'Suggested questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(farmingSuggestions[language] || farmingSuggestions['en']).map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="bg-white text-green-700 text-xs py-1 px-3 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-green-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholders[language] || placeholders['en']}
                className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              
              {/* Voice Input Button */}
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Voice Output Toggle Button */}
              <button
                onClick={toggleVoiceOutput}
                className={`p-2 rounded-lg transition-colors ${
                  voiceEnabled && !isSpeaking
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : isSpeaking
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-400 text-white hover:bg-gray-500'
                }`}
                title={
                  isSpeaking 
                    ? 'Stop speaking' 
                    : voiceEnabled 
                    ? 'Voice output enabled' 
                    : 'Voice output disabled'
                }
              >
                {voiceEnabled && !isSpeaking ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-lg ${
                  inputValue.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 text-gray-400'
                } transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>

              <button className="p-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </button>
            </div>
            
            {/* Voice Input Status */}
            {isListening && (
              <div className="mt-2 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-sm">
                    {language === 'hi' ? 'सुन रहा हूं...' : language === 'bn' ? 'শুনছি...' : 'Listening...'}
                  </span>
                </div>
              </div>
            )}

            {/* Speaking Status */}
            {isSpeaking && (
              <div className="mt-2 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-purple-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span className="text-sm">
                    {language === 'hi' ? 'बोल रहा हूं...' : language === 'bn' ? 'বলছি...' : 'Speaking...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
