
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SoilAnalysis from "./pages/dashboard/CropPrediction";
import Weather from "./pages/dashboard/Weather";
import CropPrediction from "./pages/dashboard/CropPrediction";
import DiseasePrediction from "./pages/dashboard/DiseasePrediction";
import CropProductionPrediction from "./pages/dashboard/CropProductionPrediction";
import AIAssistant from "./pages/dashboard/AIAssistant";
import Community from "./pages/dashboard/Community";
import Realtimeprediction from "./pages/dashboard/Realtimeprediction";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
          <Route path="CropPrediction" element={<CropPrediction />} />
          <Route path="DiseasePrediction" element={<DiseasePrediction />} />
          <Route path="CropProductionprediction" element={<CropProductionPrediction />} />
          <Route path="AIAssistant" element={<AIAssistant />} />
          <Route path="Community" element={<Community />} />
          <Route path="Weather" element={<Weather />} />
          <Route path="Realtimeprediction" element={<Realtimeprediction />} />

          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
