// document.addEventListener("DOMContentLoaded", () => {
//   const lastCity = localStorage.getItem("lastCity");
//   if (lastCity) {
//     const storedForecast = JSON.parse(localStorage.getItem("forecastData"));
//     if(storedForecast){
//       displayData(storedForecast);
//     }
//     else{
//       fetchWeatherData(lastCity);
//     }
//   }
// });

document.getElementById("search").addEventListener("click", async (event) => {
  event.preventDefault();
  const city_name = document.getElementById("city_name").value;
  console.log(city_name);
  try {
    const forecast = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ea25262c8e5c4fefb9e72708240708&q=${city_name}&days=6`);
    if (!forecast.ok) {
      throw new Error(`Error: ${forecast.status} ${forecast.statusText}`);
    }
    const forecast_data = await forecast.json();
    console.log(forecast_data);
    displayData(forecast_data);
    // localStorage.setItem("lastCity", city_name);
    // localStorage.setItem("forecastData", JSON.stringify(forecast_data));
  } catch (error) {
    console.error(`Error in fetching data: ${error}`);
  }
});

// async function fetchWeatherData(city) {
//   try {
//     const forecast = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ea25262c8e5c4fefb9e72708240708&q=${city}&days=6`);
//     if (!forecast.ok) {
//       throw new Error(`Error: ${forecast.status} ${forecast.statusText}`);
//     }
//     const forecast_data = await forecast.json();
//     displayData(forecast_data);
//   } catch (error) {
//     console.error(`Error in fetching data: ${error}`);
//   }
// }

function displayData(forecast_data) {
  const display = document.getElementById("weather_display");
  display.innerHTML = `
    <div class="bg-cyan-900 p-6 min-w-fit rounded-lg m-6 md:m-10 flex flex-col gap-10 items-center hover:scale-110 ease-in duration-0 shadow-3xl hover:shadow-cyan-950 outline outline-gray-400">
      <p class="text-sm text-white font-extrabold italic">
        ${forecast_data.location.name}, ${forecast_data.location.region}, ${forecast_data.location.country}, ${forecast_data.location.localtime}
      </p>
      <div class="flex text-white gap-20">
        <div class="flex flex-col justify-evenly ">
          <img width="80px" src="${forecast_data.current.condition.icon}" alt="${forecast_data.current.condition.text}" />
          <p class="text-xs font-bold self-center italic">${forecast_data.current.condition.text}</p>
        </div>
        <p class="text-3xl font-extrabold self-center">${forecast_data.current.temp_c}°C</p>
        <div class="flex flex-col font-bold text-md self-center italic">
          <p>Humidity: ${forecast_data.current.humidity}%</p>
          <p>Wind: ${forecast_data.current.wind_kph} kph</p>
          <p>Pressure: ${forecast_data.current.pressure_mb} mb</p>
        </div>
      </div>
       <div class="flex gap-10 text-xs text-white font-bold italic">
        ${forecast_data.forecast.forecastday.slice(1).map(day => {
          const date = new Date(day.date);
          const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day of the week
          return `
            <div class="forecast-day flex flex-col">
              <p class="self-center">${weekday}</p>
              <img width="60px" class="self-center" src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p>Temp: ${day.day.maxtemp_c}°C</p>
              <p>Humidity: ${day.day.avghumidity}%</p>
              <p>Wind: ${day.day.maxwind_kph} kph</p>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}
