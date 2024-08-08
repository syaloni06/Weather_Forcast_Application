document.addEventListener("DOMContentLoaded", () => {
  const lastCities = JSON.parse(localStorage.getItem("lastCities")) || [];
  const storedForecast = JSON.parse(localStorage.getItem("forecastData"));

  // Populate the dropdown and manage visibility
  populateDropdown(lastCities);

  if (lastCities.length > 0 && storedForecast) {
    displayData(storedForecast);
  } else if (lastCities.length > 0) {
    fetchWeatherData(lastCities[lastCities.length - 1]);
  }
});

document.getElementById("search").addEventListener("click", (event) => {
  event.preventDefault();
  const cityName = document.getElementById("city_name").value.trim();
  if (cityName) {
    fetchWeatherData(cityName);
    updateLastCities(cityName);
    populateDropdown(JSON.parse(localStorage.getItem("lastCities")));
  } else {
    displayError("Please enter a city name.");
  }
});

document.getElementById("current").addEventListener("click", (event) => {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = `${latitude},${longitude}`;
        fetchWeatherData(currentLocation);
        updateLastCities(currentLocation);
        populateDropdown(JSON.parse(localStorage.getItem("lastCities")));
      },
      (error) => {
        displayError("Unable to retrieve your location.");
        console.error(error);
      }
    );
  } else {
    displayError("Geolocation is not supported by your browser.");
  }
});

async function fetchWeatherData(location) {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ea25262c8e5c4fefb9e72708240708&q=${location}&days=6`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the city name and try again.");
      } else if (response.status === 401) {
        throw new Error("Unauthorized request. Please check your API key.");
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}. Please try again later.`);
      }
    }

    const forecastData = await response.json();
    if (!forecastData || !forecastData.location || !forecastData.current) {
      throw new Error("Invalid data received from the server.");
    }

    displayData(forecastData);
    localStorage.setItem("forecastData", JSON.stringify(forecastData));

  } catch (error) {
    displayError(`Error fetching weather data: ${error.message}`);
    console.error(`Error in fetching data: ${error}`);
  }
}

function updateLastCities(city) {
  let lastCities = JSON.parse(localStorage.getItem("lastCities")) || [];
  if (!lastCities.includes(city)) {
    lastCities.push(city);
    if (lastCities.length > 5) { // Keep the array limited to the last 5 cities
      lastCities.shift();
    }
    localStorage.setItem("lastCities", JSON.stringify(lastCities));
  }
}

function populateDropdown(cities) {
  const dropdown = document.getElementById("city_dropdown");
  if (cities.length > 0) {
    dropdown.style.display = "block"; // Show dropdown
    dropdown.innerHTML = '<option value="">Select a city</option>'; // Reset dropdown
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      dropdown.appendChild(option);
    });

    // Add an event listener to fetch weather data when a city is selected
    dropdown.addEventListener("change", (event) => {
      const selectedCity = event.target.value;
      if (selectedCity) {
        fetchWeatherData(selectedCity); // Fetch data from API
      }
    });
  } else {
    dropdown.style.display = "none"; // Hide dropdown
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

function displayError(errorMessage) {
  const display = document.getElementById("weather_display");
  display.innerHTML = `
    <div class="bg-red-500 p-4 rounded-lg m-6 md:m-10 text-white text-center">
      <p class="font-bold">${errorMessage}</p>
    </div>`;
}
