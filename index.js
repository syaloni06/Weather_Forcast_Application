document.addEventListener("DOMContentLoaded", () => {
  // Elements for theme toggling
  const themeToggleButton = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Check if dark mode is already enabled based on local storage
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  // Event listener for toggling theme
  themeToggleButton.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    // Update local storage and change the theme icon
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }
  });

  // Load the last searched cities and forecast data from local storage
  const lastCities = JSON.parse(sessionStorage.getItem("lastCities")) || [];
  // const storedForecast = JSON.parse(localStorage.getItem("forecastData"));

  // Populate the city dropdown menu with the last searched cities
  populateDropdown(lastCities);

  // Display the last forecasted data if available, otherwise fetch data for the last searched city
  // if (lastCities.length > 0 && storedForecast) {
  //   displayData(storedForecast);
  // } else if (lastCities.length > 0) {
  //   fetchWeatherData(lastCities[lastCities.length - 1]);
  // }

  // Event listener for the search button
  document.getElementById("search").addEventListener("click", (event) => {
    event.preventDefault();
    const cityName = document.getElementById("city_name").value.trim();
    
    // If a city name is entered, fetch the weather data
    if (cityName) {
      fetchWeatherData(cityName).then((data) => {
        if (data) {  // Proceed only if data is successfully fetched
          updateLastCities(cityName);
          populateDropdown(JSON.parse(sessionStorage.getItem("lastCities")));
          document.getElementById("city_name").value = "";
        } else {
          displayError("Failed to fetch weather data. Please try again.");
        }
      }).catch((error) => {
        console.error("Unexpected error:", error);
        displayError("An unexpected error occurred. Please try again.");
      });
    } else {
      displayError("Please enter a city name.");
    }    
  });

  // Event listener for the "Use Current Location" button
  document.getElementById("current").addEventListener("click", (event) => {
    event.preventDefault();
    
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = `${latitude},${longitude}`;
          fetchWeatherData(currentLocation);
          updateLastCities(currentLocation);
          populateDropdown(JSON.parse(sessionStorage.getItem("lastCities")));
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

  // Function to fetch weather data from the API
  async function fetchWeatherData(location) {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ea25262c8e5c4fefb9e72708240708&q=${location}&days=6`);

      // Handle different HTTP response status codes
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the city name and try again.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized request. Please check your API key.");
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}. Please try again later.`);
        }
      }

      // Parse the JSON data from the response
      const forecastData = await response.json();
      if (!forecastData || !forecastData.location || !forecastData.current) {
        throw new Error("Invalid data received from the server.");
      }

      // Display the weather data and save it to local storage
      displayData(forecastData);
      // localStorage.setItem("forecastData", JSON.stringify(forecastData));
      return forecastData;
    } catch (error) {
      displayError(`Error fetching weather data: ${error.message}`);
      console.error(`Error in fetching data: ${error}`);
      return null;
    }
  }

  // Function to update the list of last searched cities in local storage
  function updateLastCities(city) {
    let lastCities = JSON.parse(sessionStorage.getItem("lastCities")) || [];
    if (!lastCities.includes(city)) {
      lastCities.push(city);
      if (lastCities.length > 5) {
        lastCities.shift(); // Keep only the last 5 cities
      }
      sessionStorage.setItem("lastCities", JSON.stringify(lastCities));
    }
  }

  // Function to populate the city dropdown menu
  function populateDropdown(cities) {
    const dropdown = document.getElementById("city_dropdown");
    if (cities.length > 0) {
      dropdown.style.display = "block";
      dropdown.innerHTML = '<option value="">Select a city</option>';
      cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
      });

      // Event listener for when a city is selected from the dropdown
      dropdown.addEventListener("change", () => {
        const selectedCity = dropdown.value;
        if (selectedCity) {
          fetchWeatherData(selectedCity);
        }
      });
    } else {
      dropdown.style.display = "none";
    }
  }

  // Function to display weather data on the page
  function displayData(forecastData) {
    const weatherDisplay = document.getElementById("weather_display");
    const weatherInfo = `
      <div class="bg-cyan-900 dark:bg-slate-800 p-4 md:p-6 min-w-fit rounded-lg m-2 md:m-10 flex flex-col  gap-10 items-center md:hover:scale-110 ease-in duration-0 shadow-3xl hover:shadow-cyan-950 dark:hover:shadow-slate-100 outline outline-gray-400">
      <p class="text-sm text-white font-extrabold italic">
        ${forecastData.location.name}, ${forecastData.location.region}, ${forecastData.location.country}, ${forecastData.location.localtime}
      </p>
      <div class="flex text-white gap-5 md:gap-20">
        <div class="flex flex-col justify-evenly ">
          <img class="self-center animate-moveLeftRight w-14 md:w-20" src="${forecastData.current.condition.icon}" alt="${forecastData.current.condition.text}" />
          <p class="text-xs font-bold self-center italic">${forecastData.current.condition.text}</p>
        </div>
        <p class=" text-xl md:text-3xl font-extrabold self-center">${forecastData.current.temp_c}°C</p>
        <div class="flex flex-col font-bold text-sm md:text-md self-center italic">
          <p>Humidity: ${forecastData.current.humidity}%</p>
          <p>Wind: ${forecastData.current.wind_kph}kph</p>
          <p>Pressure: ${forecastData.current.pressure_mb}mb</p>
        </div>
      </div>
      <div class="flex flex-wrap justify-evenly md:flex-row gap-3 md:gap-10 text-xs text-white font-bold italic">
        ${forecastData.forecast.forecastday.slice(1).map(day => {
          const date = new Date(day.date);
          const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
          return `
            <div class="forecast-day flex flex-col">
              <p class="self-center">${weekday}</p>
              <img class="self-center animate-moveLR w-10 md:w-14" src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p>Temp: ${day.day.maxtemp_c}°C</p>
              <p>Humidity: ${day.day.avghumidity}%</p>
              <p>Wind: ${day.day.maxwind_kph} kph</p>
            </div>`;
        }).join('')}
      </div>
    </div>
    `;
    weatherDisplay.innerHTML = weatherInfo;
  }

  // Function to display error messages on the page
  function displayError(message) {
    const weatherDisplay = document.getElementById("weather_display");
    weatherDisplay.innerHTML = `
      <div class="bg-red-200 text-red-800 p-4 rounded-lg">
        ${message}
      </div>
    `;
  }
});
