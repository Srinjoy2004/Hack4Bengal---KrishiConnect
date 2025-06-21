import { useState } from 'react';

type SoilParameter = {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  rainfall: string;
  temperature: string;
  humidity: string;
};

type CropPrediction = {
  crop: string;
  confidence: number;
};

export default function CropPrediction() {
  const [soilParams, setSoilParams] = useState<SoilParameter>({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: ''
  });
  
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [predictions, setPredictions] = useState<CropPrediction[]>([]);
  const [fertilizer, setFertilizer] = useState<string>('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [isFetchingFertilizer, setIsFetchingFertilizer] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSoilParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrop(e.target.value);
    setFertilizer(''); // Clear previous fertilizer recommendations
  };
  
  const predictCrops = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsPredicting(true);
    
    try {
      const response = await fetch('https://crop-recommendation-gc3x.onrender.com/predict_crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          n: parseFloat(soilParams.nitrogen),
          p: parseFloat(soilParams.phosphorus),
          k: parseFloat(soilParams.potassium),
          temp: parseFloat(soilParams.temperature) || 0,
          humidity: parseFloat(soilParams.humidity) || 0,
          ph: parseFloat(soilParams.ph),
          rainfall: parseFloat(soilParams.rainfall) || 0
        })
      });
      
      const data = await response.json();

      if (!response.ok || !data.predictions) {
        throw new Error(data.error || 'Something went wrong with prediction');
      }

      setPredictions(data.predictions.slice(0, 5)); // Take top 5 predictions
    } catch (error) {
      console.error('Error fetching predictions:', error);
      alert('Failed to fetch crop predictions. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };
  
  const getFertilizerAdvice = async () => {
    if (!selectedCrop) {
      alert('Please select a crop first');
      return;
    }
    
    setIsFetchingFertilizer(true);
    
    try {
      const response = await fetch('https://crop-recommendation-gc3x.onrender.com/fertilizer_advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: selectedCrop,
          n: parseFloat(soilParams.nitrogen),
          p: parseFloat(soilParams.phosphorus),
          k: parseFloat(soilParams.potassium)
        })
      });
      
      const data = await response.json();

      if (!response.ok || !data.advice) {
        throw new Error(data.error || 'Something went wrong with fertilizer advice');
      }

      setFertilizer(data.advice);
    } catch (error) {
      console.error('Error fetching fertilizer advice:', error);
      alert('Failed to fetch fertilizer advice. Please try again.');
    } finally {
      setIsFetchingFertilizer(false);
    }
  };
  
  const validateInputs = () => {
    const requiredFields = ['nitrogen', 'phosphorus', 'potassium', 'ph'] as const;
    const missingFields = requiredFields.filter(field => !soilParams[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (parseFloat(soilParams.ph) < 0 || parseFloat(soilParams.ph) > 14) {
      alert('pH must be between 0 and 14');
      return false;
    }
    
    return true;
  };
  
  const resetForm = () => {
    setSoilParams({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph: '',
      rainfall: '',
      temperature: '',
      humidity: ''
    });
    setPredictions([]);
    setSelectedCrop('');
    setFertilizer('');
  };
  
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
      {/* Left Section */}
      <div className="w-full md:w-2/5 bg-green-800 p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Crop Prediction</h1>
        <p className="mb-6">Our advanced algorithms analyze multiple factors to recommend the best crops for your land.</p>
        <p className="mb-8">Enter your soil parameters and get instant AI-powered recommendations tailored to your specific conditions.</p>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>98% Accuracy</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 4h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1zm0 4h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Historical Data</span>
          </div>
        </div>
        
        {predictions.length > 0 && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Recommended Crops:</h3>
            <ul className="space-y-2">
              {predictions.map((pred, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <span className="text-lg">{pred.crop} ({(pred.confidence ).toFixed(2)}%)</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-green-600">
              <p className="text-sm opacity-80">Based on your soil parameters, these crops are most likely to thrive in your conditions.</p>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition duration-200"
          >
            Reset All Fields
          </button>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="w-full md:w-3/5 p-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-green-800">Soil Parameter Analysis</h2>
          <p className="text-gray-600 mt-1">Enter your soil test results for accurate predictions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-green-800 font-medium mb-2" htmlFor="nitrogen">
              Nitrogen (N): <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="nitrogen"
                name="nitrogen"
                value={soilParams.nitrogen}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Range, 0-140"
              />
              <span className="absolute right-3 top-2 text-gray-500">kg/ha</span>
            </div>
          </div>
          
          <div>
            <label className="block text-green-800 font-medium mb-2" htmlFor="phosphorus">
              Phosphorous (P): <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="phosphorus"
                name="phosphorus"
                value={soilParams.phosphorus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Range, 0-140"
              />
              <span className="absolute right-3 top-2 text-gray-500">kg/ha</span>
            </div>
          </div>
          
          <div>
            <label className="block text-green-800 font-medium mb-2" htmlFor="potassium">
              Potassium (K): <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="potassium"
                name="potassium"
                value={soilParams.potassium}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Range, 0-200"
              />
              <span className="absolute right-3 top-2 text-gray-500">kg/ha</span>
            </div>
          </div>
          
          <div>
            <label className="block text-green-800 font-medium mb-2" htmlFor="ph">
              pH Value: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ph"
              name="ph"
              value={soilParams.ph}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Range, 3.5-9"
            />
          </div>
          
          <div>
            <label className="block text-green-800 font-medium mb-2" htmlFor="rainfall">
              Rainfall:
            </label>
            <div className="relative">
              <input
                type="text"
                id="rainfall"
                name="rainfall"
                value={soilParams.rainfall}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Range , 0-500"
              />
              <span className="absolute right-3 top-2 text-gray-500">mm</span>
            </div>
          </div>
          
          <div>
            <label className="block text-green-800 font-medium mb-2" htmlFor="temperature">
              Temperature:
            </label>
            <div className="relative">
              <input
                type="text"
                id="temperature"
                name="temperature"
                value={soilParams.temperature}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Range, 0-60"
              />
              <span className="absolute right-3 top-2 text-gray-500">°C</span>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-green-800 font-medium mb-2" htmlFor="humidity">
              Humidity:
            </label>
            <div className="relative">
              <input
                type="text"
                id="humidity"
                name="humidity"
                value={soilParams.humidity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Range, 10-100"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={predictCrops}
          disabled={isPredicting}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {isPredicting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : "Predict Suitable Crops"}
        </button>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Select a Crop</h2>
          <p className="text-gray-600 mb-4">Choose a crop to get specific fertilizer recommendations</p>
          
          <select
            value={selectedCrop}
            onChange={handleCropChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={predictions.length === 0}
          >
            <option value="">-- Select Crop --</option>
            {predictions.map(pred => (
              <option key={pred.crop} value={pred.crop}>
                {pred.crop} ({(pred.confidence).toFixed(2)}%)
              </option>
            ))}
          </select>
          
          <button
            onClick={getFertilizerAdvice}
            disabled={isFetchingFertilizer || !selectedCrop}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isFetchingFertilizer ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Advice...
              </div>
            ) : "Get Fertilizer Advice"}
          </button>
        </div>
        
        {fertilizer && (
          <div className="mt-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Fertilizer Recommendation</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-green-800">{fertilizer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}