async function getWeatherForecast(city, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Failed to fetch data");
            return null;
        }

        const data = await response.json();
        const nextDay = data.list.slice(0, 8); // Next 24 hours (3-hour intervals)

        let totalTemp = 0;
        let totalRain = 0;

        nextDay.forEach(entry => {
            totalTemp += entry.main.temp;
            totalRain += entry.rain?.['3h'] || 0; // Optional chaining and fallback
        });

        const avgTemp = (totalTemp / 8).toFixed(2);
        const rainAmount = totalRain.toFixed(2);

        console.log(`Average Temp in ${city}: ${avgTemp}°C`);
        console.log(`Total Rainfall in ${city} (next 24h): ${rainAmount} mm`);

        return { avgTemp, rainAmount };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

// Example usage:
const city = "Kolkata";
const apiKey = "04bf89ecabf9ac4cae7a7173c5cdd1bb";
getWeatherForecast(city, apiKey);
