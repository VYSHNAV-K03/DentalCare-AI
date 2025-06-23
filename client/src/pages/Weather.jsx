import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

export const WeatherComponent = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState("");

  const getWeather = async () => {
    const data = await fetchWeather(city);
    setWeather(data);
    const forecastData = await fetchForecast(city, 3);
    setForecast(forecastData);
  };

  const API_KEY = "af8b912ddf9943a4aed54448252402"; // Replace with your API key

  const fetchWeather = async (location) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=yes`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchForecast = async (location, days = 3) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=yes`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">🌦️ Weather App</h2>
        
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" onClick={getWeather}>
            Get Weather
          </button>
        </div>

        {/* Current Weather */}
        {weather && (
          <div className="card mt-4 p-3 shadow-sm">
            <h3 className="text-center">Weather in {weather.location.name}</h3>
            <div className="d-flex justify-content-around align-items-center mt-3">
              <div>
                <h4>🌡️ {weather.current.temp_c}°C</h4>
                <p className="text-muted">Feels like {weather.current.feelslike_c}°C</p>
              </div>
              <div>
                <img src={weather.current.condition.icon} alt="Weather Icon" />
                <p>{weather.current.condition.text}</p>
              </div>
            </div>
            <div className="mt-3">
              <p>💧 Humidity: <strong>{weather.current.humidity}%</strong></p>
              <p>🌬️ Wind: <strong>{weather.current.wind_kph} kph</strong></p>
            </div>
          </div>
        )}

        {/* 3-Day Forecast */}
        {forecast && (
          <div className="mt-4">
            <h3 className="text-center">📅 3-Day Forecast</h3>
            <div className="row">
              {forecast.forecast.forecastday.map((day, index) => (
                <div key={index} className="col-md-4">
                  <div className="card p-3 shadow-sm">
                    <h5 className="text-center">{day.date}</h5>
                    <img
                      src={day.day.condition.icon}
                      alt="Weather Icon"
                      className="mx-auto d-block"
                    />
                    <p className="text-center">{day.day.condition.text}</p>
                    <p>🌡️ Avg Temp: {day.day.avgtemp_c}°C</p>
                    <p>🌧️ Rain: {day.day.daily_chance_of_rain}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
