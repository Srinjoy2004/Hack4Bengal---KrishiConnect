import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionResponse {
  predicted_production: number;
  predicted_yield?: number;
  confidence?: number;
  monthly_forecast?: Array<{
    month: string;
    rainfall: number;
    temperature: number;
    production: number;
  }>;
  environmental_factors?: {
    rainfall?: number;
    temperature_range?: string;
    soil_type?: string;
    growing_period?: string;
  };
}

export default function CropProductionPrediction() {
  const [state, setState] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [crop, setCrop] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [year, setYear] = useState<string>('2025');
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const states = ["Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
  
  const districts: Record<string, string[]> = {
    "Karnataka": ["Bangalore Urban", "Bangalore Rural", "Mysore", "Belgaum", "Gulbarga", "Raichur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Thanjavur"],
    "West Bengal": ["Howrah", "Kolkata", "North 24 Parganas", "South 24 Parganas", "Murshidabad"]
  };
  
  const crops = ["Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Groundnut", "Soybean", "Potato", "Tomato", "Onion"];
  
  const seasons = ["Kharif", "Rabi", "Zaid", "Whole Year"];
  
  const years = ["2021", "2022", "2023", "2024", "2025", "2026"];
  
  const handlePredict = async () => {
    if (!state || !district || !crop || !season || !area || !year) {
      setError('Please fill all fields');
      setShowPrediction(false);
      setPredictionData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowPrediction(false);
    setPredictionData(null);
    
    try {
      const response = await fetch('https://rudra2003-price-prediction-crops.hf.space/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          district,
          crop,
          season,
          area: parseFloat(area),
          year: parseInt(year),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      
      // Validate essential field
      if (typeof data.predicted_production !== 'number') {
        throw new Error('Invalid or missing predicted_production in API response');
      }

      setPredictionData(data);
      setShowPrediction(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching prediction');
      setPredictionData(null);
      setShowPrediction(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // SVG Icons
  const PlantIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6c.5.5 1 .5 1.5.5h.01s.99 0 1.5-.5c.49-.5.49-1 .49-1.5 0-.51 0-1-.49-1.5-.51-.5-1.5-.5-1.51-.5h-.01c-.49 0-1 0-1.49.5-.51.5-.51 1-.51 1.5 0 .5 0 1 .51 1.5Z"/>
      <path d="M12.5 8c.5.5 1 .5 1.5.5h.01s.99 0 1.5-.5c.49-.5.49-1 .49-1.5 0-.51 0-1-.49-1.5-.51-.5-1.5-.5-1.51-.5h-.01c-.49 0-1 0-1.49.5-.51.5-.51 1-.51 1.5 0 .5 0 1 .51 1.5Z"/>
      <path d="M18 9c.5.5 1 .5 1.5.5h.01s.99 0 1.5-.5c.49-.5.49-1 .49-1.5 0-.51 0-1-.49-1.5-.51-.5-1.5-.5-1.51-.5h-.01c-.49 0-1 0-1.49.5-.51.5-.51 1-.51 1.5 0 .5 0 1 .51 1.5Z"/>
      <path d="M16.5 11.5c.5.5 1 .5 1.5.5h.01s.99 0 1.5-.5c.49-.5.49-1 .49-1.5 0-.51 0-1-.49-1.5-.51-.5-1.5-.5-1.51-.5h-.01c-.49 0-1 0-1.49.5-.51.5-.51 1-.51 1.5 0 .5 0 1 .51 1.5Z"/>
      <path d="M14 11.5c.5.5 1 .5 1.5.5s1-.5 1.5-.5c.5-.5.5-1 .5-1.5s0-1-.5-1.5c-.5-.5-1-.5-1.5-.5s-1 0-1.5.5c-.5.5-.5 1-.5 1.5s0 1 .5 1.5Z"/>
      <path d="M13.5 16c.5-.5.5-1 .5-1.5s-.5-1-.5-1.5c-.5-.5-1-.5-1.5-.5s-1 .5-1.5.5c-.5.5-.5 1-.5 1.5s0 1 .5 1.5c.5.5 1 .5 1.5.5s1 0 1.5-.5Z"/>
      <path d="M16.5 15c0 .5-.5 1-1 1s-1-.5-1.5-.5c-.5 0-1 .5-1.5.5s-1-.5-1.5-.5c-.5 0-1 .5-1.5.5-1 0-1.5-.5-1.5-1s.5-1 1-1 1 .5 1.5.5c.5 0 1-.5 1.5-.5s1 .5 1.5.5c.5 0 1-.5 1.5-.5.5 0 1 .5 1 1Z"/>
      <path d="M18 21H6a2 2 0 0 1-2-2v-8h16v8a2 2 0 0 1-2 2Z"/>
    </svg>
  );
  
  const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );

  const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
  );

  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
    </svg>
  );

  const DropletsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="text-green-600">
            <PlantIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Crop Production Prediction</h1>
        </div>
        <p className="text-green-700 mb-8">Have questions or need assistance? We're here to help.</p>
        
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <div className="relative">
                <select
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict('');
                  }}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
                >
                  <option value="">Select a state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <div className="relative">
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
                  disabled={!state || !districts[state]}
                >
                  <option value="">Select a District</option>
                  {state && districts[state]?.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-2">Crop</label>
              <div className="relative">
                <select
                  id="crop"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
                >
                  <option value="">Select a Crop</option>
                  {crops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-2">Season</label>
              <div className="relative">
                <select
                  id="season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
                >
                  <option value="">Select a Season</option>
                  {seasons.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">Area (hectares)</label>
              <input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter cultivated area"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <div className="relative">
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className={`w-full mt-8 p-4 rounded-lg text-white font-medium transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="mr-2">
              <BarChartIcon />
            </span>
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {showPrediction && predictionData && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Production Prediction</h2>
              
              <div className="grid lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-700">Total Production</h3>
                    <div className="text-green-600">
                      <BarChartIcon />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                    {typeof predictionData.predicted_production === 'number' ? predictionData.predicted_production.toFixed(1) : 'N/A'} tonnes
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total expected production</p>
                </div>
                
                {typeof predictionData.predicted_yield === 'number' && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-700">Estimated Yield</h3>
                      <div className="text-green-600">
                        <PlantIcon />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      {predictionData.predicted_yield.toFixed(1)} q/ha
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Quintals per hectare</p>
                  </div>
                )}
                
                {typeof predictionData.confidence === 'number' && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-700">Confidence</h3>
                      <div className="text-green-600">
                        <CheckIcon />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      {(predictionData.confidence * 100).toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Prediction accuracy</p>
                  </div>
                )}
              </div>
              
              {Array.isArray(predictionData.monthly_forecast) && (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Production Forecast</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={predictionData.monthly_forecast.map(item => ({
                            name: item.month ?? 'Unknown',
                            rainfall: typeof item.rainfall === 'number' ? item.rainfall : 0,
                            temperature: typeof item.temperature === 'number' ? item.temperature : 0,
                            production: typeof item.production === 'number' ? item.production : 0,
                          }))}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="production" 
                            stroke="#16a34a" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {predictionData.environmental_factors && (
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Environmental Factors</h3>
                      
                      <div className="space-y-4">
                        {typeof predictionData.environmental_factors.rainfall === 'number' && (
                          <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <span className="text-blue-600">
                                <DropletsIcon />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-700">Average Rainfall</p>
                              <p className="text-sm text-gray-600">
                                {predictionData.environmental_factors.rainfall.toFixed(1)} mm per month
                              </p>
                            </div>
                            <div className="bg-blue-50 px-3 py-1 rounded-full">
                              <span className="text-blue-800 font-medium">Adequate</span>
                            </div>
                          </div>
                        )}
                        
                        {predictionData.environmental_factors.temperature_range && (
                          <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                            <div className="bg-orange-100 p-2 rounded-full mr-3">
                              <span className="text-orange-600">
                                <ThermometerIcon />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-700">Temperature Range</p>
                              <p className="text-sm text-gray-600">
                                {predictionData.environmental_factors.temperature_range}
                              </p>
                            </div>
                            <div className="bg-green-50 px-3 py-1 rounded-full">
                              <span className="text-green-800 font-medium">Optimal</span>
                            </div>
                          </div>
                        )}
                        
                        {predictionData.environmental_factors.soil_type && (
                          <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <span className="text-green-600">
                                <MapIcon />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-700">Soil Type</p>
                              <p className="text-sm text-gray-600">
                                {predictionData.environmental_factors.soil_type}
                              </p>
                            </div>
                            <div className="bg-green-50 px-3 py-1 rounded-full">
                              <span className="text-green-800 font-medium">Suitable</span>
                            </div>
                          </div>
                        )}
                        
                        {predictionData.environmental_factors.growing_period && (
                          <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                            <div className="bg-yellow-100 p-2 rounded-full mr-3">
                              <span className="text-yellow-600">
                                <CalendarIcon />
                              </span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-700">Growing Period</p>
                              <p className="text-sm text-gray-600">
                                {predictionData.environmental_factors.growing_period}
                              </p>
                            </div>
                            <div className="bg-green-50 px-3 py-1 rounded-full">
                              <span className="text-green-800 font-medium">Normal</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}