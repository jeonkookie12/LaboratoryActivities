import { useState, useEffect } from "react";
import clockIcon from "./assets/weathers/recents.svg";

// Weather icons
import sunIcon from "./assets/weathers/sun.gif";
import rainIcon from "./assets/weathers/rain.gif";
import cloudIcon from "./assets/weathers/cloud.gif";
import snowIcon from "./assets/weathers/snow.gif";
import stormIcon from "./assets/weathers/thunderstorm.gif";
import partlyIcon from "./assets/weathers/partly.gif";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [fade, setFade] = useState(false);
  const [forecastFade, setForecastFade] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 🔹 Fetch recent searches
  const fetchRecentSearches = async () => {
    try {
      const res = await fetch("http://localhost:3000/weather/history");
      if (!res.ok) throw new Error("Failed to fetch search history");
      const data = await res.json();

      // Remove duplicates (case-insensitive)
      const unique = Array.from(
        new Set(data.map((d) => d.city.toLowerCase()))
      ).map((city) => data.find((d) => d.city.toLowerCase() === city));

      setRecentSearches(unique);
    } catch (err) {
      console.error("Error loading search history:", err);
    }
  };

  // 🔹 Get weather data
  const getWeather = async (searchCity = city) => {
    const trimmedCity = searchCity.trim();
    if (!trimmedCity) {
      setError("⚠️ Please enter a city name.");
      return;
    }

    try {
      setError("");
      setFade(true);

      const res = await fetch(
        `http://localhost:3000/weather?city=${encodeURIComponent(trimmedCity)}`
      );

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      if (data.error) {
        setError(`⚠️ ${data.error}`);
        setFade(false);
        return;
      }

      // ✅ Smooth transition for updates
      setTimeout(() => {
        setWeather(data);
        setSelectedForecast(null);
        setCity("");
        setFade(false);
        fetchRecentSearches();
      }, 400);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("⚠️ Unable to fetch weather data. Please try again later.");
      setFade(false);
    }
  };

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const getIcon = (desc) => {
    if (!desc) return partlyIcon;
    desc = desc.toLowerCase();
    if (desc.includes("rain")) return rainIcon;
    if (desc.includes("cloud")) return cloudIcon;
    if (desc.includes("clear")) return sunIcon;
    if (desc.includes("snow")) return snowIcon;
    if (desc.includes("storm")) return stormIcon;
    return partlyIcon;
  };

  const handleForecastSelect = (i) => {
    setForecastFade(true);
    setTimeout(() => {
      setSelectedForecast((prev) => (prev === i ? null : i));
      setForecastFade(false);
    }, 600);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.trim()) {
      const filtered = recentSearches.filter((item) =>
        item.city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (selectedCity) => {
    setCity(selectedCity);
    setShowSuggestions(false);
    getWeather(selectedCity);
  };

  const activeData = selectedForecast
    ? weather?.forecast?.[selectedForecast]
    : weather?.current;

  // 🧩 Align today's forecast with current data
  const todayStr = new Date().toISOString().split("T")[0];
  const alignedForecast = weather?.forecast?.map((f) =>
    f.date === todayStr
      ? {
          ...f,
          temp: weather.current?.temperature,
          description: weather.current?.description,
        }
      : f
  );

  const formattedDate = new Date(
    selectedForecast && weather?.forecast?.[selectedForecast]?.date
      ? weather.forecast[selectedForecast].date
      : new Date()
  ).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 overflow-y-auto py-10">
      <div
        className={`w-[760px] max-w-[90%] bg-white rounded-3xl p-10 shadow-lg text-center border border-blue-100 
        flex flex-col transition-all duration-700 ease-in-out`}
      >
        <h1 className="text-2xl font-semibold mb-6 text-blue-700">Weather</h1>

        {/* 🔍 SEARCH BAR */}
        <div className="flex flex-col items-start mb-5 relative w-full">
          <div className="flex gap-3 w-full relative">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={handleInputChange}
                onFocus={() => city && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm pr-10"
              />
              {city && (
                <button
                  onClick={() => setCity("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}

              {/* 🕒 Dropdown Recent Searches */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 z-20 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-md text-left">
                  <div className="px-4 py-3 border-b border-gray-100 text-xs font-semibold text-blue-500 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick(item.city)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
                      >
                        <img
                          src={clockIcon}
                          alt="recent"
                          className="w-4 h-4 opacity-70"
                        />
                        {item.city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => getWeather(city)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Search
            </button>
          </div>

          {/* ❗ Error message */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden w-full ${
              error ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="w-full bg-blue-600 text-white rounded-xl py-3 px-5 text-sm font-medium shadow-sm text-center">
              {error}
            </div>
          </div>

          {/* 🕒 Static Recent Searches */}
          {!weather && (
            <div className="mt-6 w-full text-left px-3">
              <h3 className="text-xs font-semibold mb-3 text-gray-500 uppercase tracking-wider">
                Recent Searches
              </h3>
              {recentSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => getWeather(item.city)}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm transition-all border border-gray-200 shadow-sm"
                    >
                      <img
                        src={clockIcon}
                        alt="recent"
                        className="w-4 h-4 opacity-70"
                      />
                      {item.city}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No recent searches yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 🌦️ WEATHER DISPLAY */}
        <div
          className={`flex flex-col justify-center items-center transition-all duration-500 py-6 ${
            fade ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {weather ? (
            <>
              <div
                className={`flex flex-col items-center transition-all duration-700 ${
                  forecastFade
                    ? "opacity-0 translate-y-3"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <h2 className="text-4xl font-semibold text-black">
                  {weather.city || "—"}
                </h2>
                <p className="text-base text-gray-500 mt-2">{formattedDate}</p>

                <img
                  src={getIcon(activeData.description)}
                  alt="Weather Icon"
                  className="w-28 h-28 mt-6 mb-3 drop-shadow-md object-contain"
                />
                <h2 className="text-6xl font-light text-gray-800">
                  {Math.round(activeData.temp ?? activeData.temperature)}°
                </h2>
                <p className="capitalize text-gray-700 mt-3 text-sm">
                  {activeData.description}
                </p>

                {/* 🌡️ Show humidity & wind speed for selected forecast only */}
                  {(!selectedForecast ||
                  (weather?.forecast?.[selectedForecast]?.date === todayStr)) && (
                  <div className="mt-3 text-sm text-gray-400 space-y-1 transition-all duration-500">
                    <p>Humidity: {weather?.current?.humidity ?? ""}%</p>
                    <p>Wind Speed: {weather?.current?.wind_speed ?? ""} km/h</p>
                  </div>
                )}
              </div>

              {/* 🌈 5-DAY FORECAST */}
              <div className="border-t border-gray-100 pt-6 mt-8 w-full">
                <h3 className="text-sm font-medium mb-5 text-gray-600 uppercase tracking-wider">
                  5-Day Forecast
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                  {alignedForecast?.map((f, i) => {
                    const isActive = selectedForecast === i;
                    return (
                      <div
                        key={i}
                        onClick={() => handleForecastSelect(i)}
                        className={`rounded-2xl py-5 px-6 border flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm w-full ${
                          isActive
                            ? "bg-blue-50 border-blue-300 scale-105"
                            : "bg-white border-gray-100 hover:shadow-md"
                        }`}
                      >
                        <img
                          src={getIcon(f.description)}
                          alt="icon"
                          className="w-10 h-10 mb-2 object-contain"
                        />
                        <p className="font-semibold text-gray-700 text-sm">
                          {new Date(f.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                        <p className="text-lg font-light text-blue-700">
                          {Math.round(f.temp)}°C
                        </p>
                        <p className="capitalize text-gray-500 text-xs mt-1">
                          {f.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic transition-opacity duration-500 py-1">
              Search a city to view weather details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;
