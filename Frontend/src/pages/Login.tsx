import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "mr", name: "मराठी (Marathi)" },
];

export default function Login() {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login"); // State to control the active tab

  // Content for different languages 
  const content = {
    en: {
      login: "Login",
      signup: "Sign Up",
      welcomeBack: "Welcome back",
      loginDesc: "Enter your credentials to access your account",
      signupDesc: "Create an account to access smart farming tools",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      rememberMe: "Remember me",
      forgotPassword: "Forgot Password?",
      loginButton: "Login",
      signupButton: "Sign Up",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      or: "or",
      continueWith: "Continue with",
    },
    hi: {
      login: "लॉगिन",
      signup: "साइन अप",
      welcomeBack: "वापसी पर स्वागत है",
      loginDesc: "अपने खाते तक पहुंचने के लिए अपने क्रेडेंशियल दर्ज करें",
      signupDesc: "स्मार्ट फार्मिंग टूल्स का उपयोग करने के लिए एक खाता बनाएं",
      emailLabel: "ईमेल",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      phoneLabel: "फोन नंबर",
      phonePlaceholder: "अपना फोन नंबर दर्ज करें",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      confirmPasswordPlaceholder: "अपना पासवर्ड फिर से दर्ज करें",
      nameLabel: "पूरा नाम",
      namePlaceholder: "अपना पूरा नाम दर्ज करें",
      rememberMe: "मुझे याद रखें",
      forgotPassword: "पासवर्ड भूल गए?",
      loginButton: "लॉगिन करें",
      signupButton: "साइन अप करें",
      dontHaveAccount: "खाता नहीं है?",
      alreadyHaveAccount: "पहले से ही एक खाता है?",
      or: "या",
      continueWith: "के साथ जारी रखें",
    },
  };

  // Get content based on current language (fallback to English)
  const t = content[currentLanguage.code as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-50 to-agri-100/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{currentLanguage.code.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setCurrentLanguage(lang)}
                className="cursor-pointer"
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-center">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-agri-400 to-agri-600 flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-2xl font-bold gradient-text">KrishiConnect</span>
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">{t.login}</TabsTrigger>
            <TabsTrigger value="signup">{t.signup}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t.welcomeBack}</CardTitle>
                <CardDescription>{t.loginDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);

                    const email = (document.getElementById("email") as HTMLInputElement).value;
                    const password = (document.getElementById("password") as HTMLInputElement).value;

                    try {
                      const response = await fetch("https://kirshiconnect-backend.onrender.com/api/auth/login", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include", // Include cookies for session
                        body: JSON.stringify({ email, password }),
                      });

                      const data = await response.json();
                      console.log("API Response:", data);

                      if (response.ok) {
                        alert(data.msg || "Login successful");
                        // Store user data in localStorage or context if needed
                        localStorage.setItem("user", JSON.stringify({ name: data.user?.name, email: data.user?.email }));
                        navigate("/dashboard");
                      } else {
                        console.warn("Login failed:", data.msg);
                        alert(data.msg || "Login failed");
                      }
                    } catch (error) {
                      console.error("Login Error:", error);
                      alert("Something went wrong while logging in.");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t.emailLabel}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t.passwordLabel}</Label>
                        <Link to="/forgot-password" className="text-sm text-agri-600 hover:text-agri-700">
                          {t.forgotPassword}
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t.passwordPlaceholder}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-agri-600 focus:ring-agri-600"
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        {t.rememberMe}
                      </Label>
                    </div>
                    <Button type="submit" className="w-full bg-agri-500 hover:bg-agri-600" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t.loginButton}...
                        </span>
                      ) : (
                        t.loginButton
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {t.or}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button" className="w-full">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"></path>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{t.signup}</CardTitle>
                <CardDescription>{t.signupDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const name = (document.getElementById("name") as HTMLInputElement).value;
                    const email = (document.getElementById("signup-email") as HTMLInputElement).value;
                    const phone = (document.getElementById("phone") as HTMLInputElement).value;
                    const password = (document.getElementById("signup-password") as HTMLInputElement).value;
                    const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;

                    if (password !== confirmPassword) {
                      alert("Passwords do not match");
                      return;
                    }

                    try {
                      const response = await fetch("https://kirshiconnect-backend.onrender.com/api/auth/register", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                          name,
                          email,
                          phone,
                          password,
                          confirmPassword,
                        }),
                      });
                  
                      const data = await response.json();
                      console.log("API Response:", data);
                  
                      alert(data.msg || "Something went wrong");
                  
                      if (response.ok) {
                        localStorage.setItem("user", JSON.stringify({ name, email }));
                        setActiveTab("login"); // Switch to login tab instead of navigating
                      }
                  
                    } catch (error) {
                      console.error("Error:", error);
                      alert("Something went wrong!");
                    }
                  }}
                >
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t.nameLabel}</Label>
                      <Input id="name" placeholder={t.namePlaceholder} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">{t.emailLabel}</Label>
                      <Input id="signup-email" type="email" placeholder={t.emailPlaceholder} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">{t.phoneLabel}</Label>
                      <Input id="phone" type="tel" placeholder={t.phonePlaceholder} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">{t.passwordLabel}</Label>
                      <Input id="signup-password" type="password" placeholder={t.passwordPlaceholder} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">{t.confirmPasswordLabel}</Label>
                      <Input id="confirm-password" type="password" placeholder={t.confirmPasswordPlaceholder} required />
                    </div>
                    <Button type="submit" className="w-full bg-agri-500 hover:bg-agri-600">
                      {t.signupButton}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {t.or}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button" className="w-full">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"></path>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
