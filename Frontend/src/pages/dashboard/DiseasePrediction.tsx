import { useState } from 'react';
import { Upload, Camera, Leaf, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function DiseasePredictionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    description: string;
    treatment: string[];
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      setSelectedFile(file);
      
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      console.log('Dropped file:', file);
      setSelectedFile(file);
      
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);
      setResult(null);
    }
  };

  const fetchGeminiTreatment = async (disease: string) => {
    const apiKey = 'AIzaSyDD8QW1BggDVVMLteDygHCHrD6Ff9Dy0e8';
    const prompt = `Provide a concise description (1-2 sentences) of the plant disease "${disease}" and suggest exactly 3 bullet point treatments. Format the response as:
Description: [Your description]
Treatments:
- [Treatment 1]
- [Treatment 2]
- [Treatment 3]`;

    try {
      console.log('Sending request to Gemini API for disease:', disease);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      console.log('Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', data);
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No valid response from Gemini API');
      }
      
      // Parse the response
      const descriptionMatch = text.match(/Description: (.*?)\nTreatments:/s);
      const treatmentsMatch = text.match(/- (.*?)(?:\n- (.*?))?(?:\n- (.*?))?$/s);
      
      return {
        description: descriptionMatch ? descriptionMatch[1].trim() : 'No description available.',
        treatments: treatmentsMatch ? treatmentsMatch.slice(1).filter(t => t).map(t => t.trim()) : []
      };
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      return {
        description: 'Unable to fetch description.',
        treatments: ['Consult a local agricultural expert for treatment options.']
      };
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      setResult({
        disease: 'Error',
        confidence: 0,
        description: 'Please upload an image to analyze.',
        treatment: ['Select an image and try again.']
      });
      setIsAnalyzing(false);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Create FormData and append file
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Debug FormData content
      console.log('FormData content:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Call the disease prediction API
      console.log('Sending request to prediction API...');
      const predictionResponse = await fetch('https://render-begins-musharraf.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Prediction API response status:', predictionResponse.status);
      
      if (!predictionResponse.ok) {
        const errorText = await predictionResponse.text();
        console.error('Prediction API error:', errorText);
        throw new Error(`API request failed with status ${predictionResponse.status}: ${errorText}`);
      }
      
      const predictionData = await predictionResponse.json();
      console.log('Prediction API response data:', predictionData);
      
      const disease = predictionData.prediction || 'Unknown Disease';
      
      // Fetch treatment recommendations from Gemini API
      const { description, treatments } = await fetchGeminiTreatment(disease);
      
      setResult({
        disease,
        confidence: predictionData.confidence || 90,
        description,
        treatment: treatments
      });
      console.log('Setting result:', { disease, confidence: predictionData.confidence || 90, description, treatment: treatments });
    } catch (error) {
      console.error('Error during analysis:', error);
      setResult({
        disease: 'Analysis Failed',
        confidence: 0,
        description: 'Unable to analyze the image.',
        treatment: ['Please try again or contact support.']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center mb-3">
            <Leaf className="text-green-600 mr-2" size={32} />
            <h1 className="text-5xl font-bold text-gray-800">Disease Prediction</h1>
          </div>
          <p className="mt-3 text-lg text-green-700 font-medium">
            Identify plant diseases instantly by uploading images and receive treatment recommendations
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left column - Upload section */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-3 bg-green-100 rounded-full">
                  <Camera className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Upload Plant Image</h2>
                  <p className="text-green-600">Supported formats: JPG, PNG, WEBP</p>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  previewUrl 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {previewUrl ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full max-w-md mb-4">
                      <img 
                        src={previewUrl} 
                        alt="Plant preview" 
                        className="max-h-64 w-full object-contain rounded-lg shadow-md" 
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          resetForm();
                        }}
                        className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className="text-sm text-gray-600 font-medium">{selectedFile?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-green-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Drag and drop your plant image here</p>
                    <p className="text-gray-500 text-sm">or click to browse files</p>
                  </div>
                )}
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className={`w-full mt-6 p-4 rounded-lg text-white font-medium flex items-center justify-center transition-all ${
                  !selectedFile || isAnalyzing
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={20} />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-2" size={20} />
                    Analyze Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right column - Results */}
          <div className="md:col-span-2">
            {result ? (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-100">
                <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Analysis Result</h2>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">Detected Issue:</h3>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">{result.disease}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Confidence:</h3>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{result.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-medium text-gray-800 mb-2">Disease Description:</h3>
                  <p className="text-gray-700 text-sm mb-2">{result.description}</p>
                  <h3 className="font-medium text-gray-800 mb-2">Recommended Treatment:</h3>
                  <ul className="text-gray-700 text-sm leading-relaxed list-disc pl-5">
                    {result.treatment.map((treatment, index) => (
                      <li key={index}>{treatment}</li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={resetForm}
                  className="w-full mt-6 p-3 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 font-medium flex items-center justify-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Analyze Another Plant
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-100">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="p-2 bg-green-100 rounded-full">
                    <AlertCircle className="text-green-600" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">How It Works</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-full h-6 w-6 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-medium text-sm">1</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Upload a clear image of the affected plant part</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-full h-6 w-6 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-medium text-sm">2</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Click analyze to process the image</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-full h-6 w-6 flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-medium text-sm">3</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">Get instant disease detection and treatment advice</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Recent Detections</h2>
              </div>
              <div className="space-y-3">
                {[
                  { plantType: "Tomato", disease: "Early Blight", date: "April 15, 2025", status: "treated" },
                  { plantType: "Potato", disease: "Late Blight", date: "April 12, 2025", status: "monitoring" },
                  { plantType: "Apple", disease: "Cedar Apple Rust", date: "April 10, 2025", status: "treated" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                    <div className={`w-2 h-10 mr-3 rounded-full ${item.status === 'treated' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.plantType}</p>
                      <p className="text-sm text-gray-500">{item.disease}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{item.date}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'treated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'treated' ? 'Treated' : 'Monitoring'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}