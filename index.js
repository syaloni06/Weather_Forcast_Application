document.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  const storedForecast = JSON.parse(localStorage.getItem("forecastData"));

  if (lastCity && storedForecast) {
    displayData(storedForecast);
  } else if (lastCity) {
    fetchWeatherData(lastCity);
  }
});

document.getElementById("search").addEventListener("click", (event) => {
  event.preventDefault();
  const cityName = document.getElementById("city_name").value;
  fetchWeatherData(cityName);
});

document.getElementById("current").addEventListener("click", (event) => {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = `${latitude},${longitude}`;
        fetchWeatherData(currentLocation);
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser");
  }
});

async function fetchWeatherData(location) {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ea25262c8e5c4fefb9e72708240708&q=${location}&days=6`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const forecastData = await response.json();
    displayData(forecastData);
    localStorage.setItem("lastCity", location);
    localStorage.setItem("forecastData", JSON.stringify(forecastData));

  } catch (error) {
    console.error(`Error in fetching data: ${error}`);
  }
}

function displayData(forecastData) {
  const display = document.getElementById("weather_display");
  display.innerHTML = `
    <div class="bg-cyan-900 p-6 min-w-fit rounded-lg m-6 md:m-10 flex flex-col gap-10 items-center hover:scale-110 ease-in duration-0 shadow-3xl hover:shadow-cyan-950 outline outline-gray-400">
      <p class="text-sm text-white font-extrabold italic">
        ${forecastData.location.name}, ${forecastData.location.region}, ${forecastData.location.country}, ${forecastData.location.localtime}
      </p>
      <div class="flex text-white gap-20">
        <div class="flex flex-col justify-evenly ">
          <img width="80px" class="self-center animate-moveLeftRight" src="${forecastData.current.condition.icon}" alt="${forecastData.current.condition.text}" />
          <p class="text-xs font-bold self-center italic">${forecastData.current.condition.text}</p>
        </div>
        <p class="text-3xl font-extrabold self-center">${forecastData.current.temp_c}°C</p>
        <div class="flex flex-col font-bold text-md self-center italic">
          <p>Humidity: ${forecastData.current.humidity}%</p>
          <p>Wind: ${forecastData.current.wind_kph} kph</p>
          <p>Pressure: ${forecastData.current.pressure_mb} mb</p>
        </div>
      </div>
      <div class="flex gap-10 text-xs text-white font-bold italic">
        ${forecastData.forecast.forecastday.slice(1).map(day => {
          const date = new Date(day.date);
          const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
          return `
            <div class="forecast-day flex flex-col">
              <p class="self-center">${weekday}</p>
              <img width="60px" class="self-center animate-moveLR" src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p>Temp: ${day.day.maxtemp_c}°C</p>
              <p>Humidity: ${day.day.avghumidity}%</p>
              <p>Wind: ${day.day.maxwind_kph} kph</p>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}
