import { useState, useEffect } from "react";
import './App.css';
import Temperature from './components/Temperature';
import Highlights from './components/Highlights';

function App() {
  const [city, setCity] = useState("Bangkok");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiKey = "aea55b82aafd48ee8f092718242911"; // เปลี่ยนเป็น API key ของคุณ
      const apiURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

      console.log("Fetching data from:", apiURL);

      try {
        const res = await fetch(apiURL);
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Data received:", data);
        setWeatherData(data);
        setError(null); // ล้างข้อผิดพลาดหากคำขอสำเร็จ
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message); // เก็บข้อผิดพลาดไว้ใน state
      }
    };

    fetchWeatherData();
  }, [city]);

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen flex flex-col items-center p-4">
      <div className="w-full sm:w-full md:w-3/5 lg:w-1/3 mt-10">
        {weatherData && (
          <Temperature
            setCity={setCity}
            stats={{
              temp: weatherData.current.temp_c,
              condition: weatherData.current.condition.text,
              isDay: weatherData.current.is_day,
              location: weatherData.location.name,
              time: weatherData.location.localtime,
            }}
          />
        )}
        {error && (
          <div className="text-red-500 mt-4">
            <p>Error: {error}</p>
            <p>Please check your city name or API key.</p>
          </div>
        )}
      </div>

      <div className="w-full sm:w-full md:w-3/5 lg:w-2/3 mt-20 p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <h1 className="text-slate-200 text-2xl col-span-2 text-center">
          Today's Highlights
        </h1>
        {weatherData ? (
          <>
            <Highlights
              stats={{
                title: "Wind Status",
                value: weatherData.current.wind_mph,
                unit: "mph",
                direction: weatherData.current.wind_dir,
              }}
            />
            <Highlights
              stats={{
                title: "Humidity",
                value: weatherData.current.humidity,
                unit: "%",
              }}
            />
            <Highlights
              stats={{
                title: "Visibility",
                value: weatherData.current.vis_miles,
                unit: "miles",
              }}
            />
            <Highlights
              stats={{
                title: "Air Pressure",
                value: weatherData.current.pressure_mb,
                unit: "mb",
              }}
            />
          </>
        ) : !error && (
          <div className="text-slate-300 text-center col-span-2">
            Loading weather data...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
