
import { useEffect } from "react";
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets,
  ThermometerSun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Weather() {
  useEffect(() => {
    document.title = "Weather Forecast - AgriSmart";
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
        <p className="text-gray-600">7-day weather forecast for your farm location</p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-sky-50 to-blue-100">
        <CardHeader>
          <CardTitle>Today's Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <CloudSun className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">32°C</p>
                <p className="text-sm text-gray-600">Partly Cloudy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Wind className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12 km/h</p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">75%</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          {
            day: "Tomorrow",
            temp: "30°C",
            icon: Sun,
            condition: "Sunny",
            precipitation: "0%",
            bgColor: "from-yellow-50 to-orange-100"
          },
          {
            day: "Wednesday",
            temp: "28°C",
            icon: CloudRain,
            condition: "Light Rain",
            precipitation: "40%",
            bgColor: "from-blue-50 to-indigo-100"
          },
          {
            day: "Thursday",
            temp: "29°C",
            icon: CloudSun,
            condition: "Partly Cloudy",
            precipitation: "20%",
            bgColor: "from-sky-50 to-blue-100"
          },
          {
            day: "Friday",
            temp: "31°C",
            icon: Sun,
            condition: "Sunny",
            precipitation: "0%",
            bgColor: "from-yellow-50 to-orange-100"
          }
        ].map((forecast) => (
          <Card key={forecast.day} className={`bg-gradient-to-br ${forecast.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{forecast.day}</CardTitle>
              <forecast.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forecast.temp}</div>
              <div className="text-sm text-gray-600">{forecast.condition}</div>
              <div className="text-xs text-gray-500 mt-1">
                Precipitation: {forecast.precipitation}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agriculture Advisory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <ThermometerSun className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-green-800">Optimal Conditions</p>
                  <p className="text-sm text-gray-600">
                    Current weather conditions are ideal for wheat cultivation. Consider irrigation in the evening.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <CloudSun className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <p className="font-medium text-yellow-800">Weather Alert</p>
                  <p className="text-sm text-gray-600">
                    Light rainfall expected next week. Plan your harvesting activities accordingly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg. Temperature</p>
                  <p className="text-2xl font-bold text-blue-700">29°C</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Rainfall</p>
                  <p className="text-2xl font-bold text-green-700">85mm</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This month shows above-average temperatures and normal precipitation levels,
                ideal for current crop growth stages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
