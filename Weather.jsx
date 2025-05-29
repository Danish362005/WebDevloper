import React, { useState } from "react";

function MyComponent() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [aqiLoading, setAqiLoading] = useState(false);

    const apiKey = "fd3790fbcb0a41a3358c4bd067fd9c11";

    const fetchWeather = async () => {
        if (!city) return;
        setLoading(true);
        setWeather(null);
        setAqi(null);
        setError("");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();

            if (data.cod === "404") {
                setError("City Not Found");
            } else {
                setWeather(data);
            }
        } catch (error) {
            setError("Failed to fetch weather data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAQI = async () => {
        if (!weather) return;

        const { lat, lon } = weather.coord;
        setAqiLoading(true);
        setAqi(null);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
            );
            const data = await response.json();
            setAqi(data.list[0].main.aqi);
        } catch (error) {
            console.error("Failed to fetch AQI:", error);
            setAqi(null);
        } finally {
            setAqiLoading(false);
        }
    };

    const getAQILevel = (aqi) => {
        const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
        return levels[aqi - 1] || "Unknown";
    };

    const getAQIColor = (aqi) => {
        switch (aqi) {
            case 1: return "green";
            case 2: return "yellowgreen";
            case 3: return "orange";
            case 4: return "red";
            case 5: return "purple";
            default: return "gray";
        }
    };

    return (
        <div className="box">
            <h2>Weather App</h2>

            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="int"
                />
            <button onClick={fetchWeather}className="btn">
                Get Weather
            </button>

            {loading && <p>Loading weather...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {weather && (
                <div style={{ marginTop: "20px" }}>
                    <h3>{weather.name}, {weather.sys.country}</h3>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt="weather icon"
                    />
                    <p>{weather.weather[0].description}</p>
                    <p>🌡️ Temperature: {weather.main.temp}°C</p>
                    <p>💧 Humidity: {weather.main.humidity}%</p>
                    <p>💨 Wind: {weather.wind.speed} m/s</p>

                    <button onClick={fetchAQI} className="btn2">
                        Get AQI
                    </button>

                    {aqiLoading && <p>Loading AQI...</p>}

                    {aqi && (
                        <p style={{
                            backgroundColor: getAQIColor(aqi),
                            padding: "6px",
                            borderRadius: "5px",
                            color: "white",
                            marginTop: "10px",
                            display: "inline-block"
                        }}>
                            Air Quality: {getAQILevel(aqi)} (AQI {aqi})
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default MyComponent;





