// document.addEventListener("DOMContentLoaded", () => {
//     const lastCity = localStorage.getItem("lastCity");
//     if (lastCity) {
//       fetchWeatherData(lastCity);
//     }
//   });
  
  document.getElementById("search").addEventListener("click", async (event) => {
    event.preventDefault();
    const city_name = document.getElementById("city_name").value;
    console.log(city_name);
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=ea25262c8e5c4fefb9e72708240708&q=${city_name}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      displayData(data);
      localStorage.setItem("lastCity", city_name);
    } catch (error) {
      console.error(`Error in fetching data: ${error}`);
    }
  });
  
//   function fetchWeatherData(city) {
//     fetch(`http://api.weatherapi.com/v1/current.json?key=ea25262c8e5c4fefb9e72708240708&q=${city}`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status} ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         displayData(data);
//       })
//       .catch(error => {
//         console.error(`Error in fetching data: ${error}`);
//       });
//   }
  
  function displayData(data) {
    const display = document.getElementById("weather_display");
    display.innerHTML = `
      <div class="bg-cyan-900 p-6 min-w-fit rounded-lg m-6 md:m-10 flex flex-col gap-6 items-center hover:scale-110 ease-in duration-0 shadow-3xl hover:shadow-cyan-950 outline outline-gray-400">
        <p class="text-sm text-white font-extrabold italic">
          ${data.location.name}, ${data.location.region}, ${data.location.country}, ${data.location.localtime}
        </p>
        <div class="flex text-white gap-14">
          <div class="flex flex-col justify-evenly ">
            <img width="80px" src="${data.current.condition.icon}" alt="${data.current.condition.text}" />
            <p class="text-xs font-bold self-center italic">${data.current.condition.text}</p>
          </div>
          <p class="text-3xl font-extrabold self-center">${data.current.temp_c}°C</p>
          <div class="flex flex-col font-bold text-md self-center italic">
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph</p>
            <p>Pressure: ${data.current.pressure_mb} mb</p>
          </div>
        </div>
      </div>`;
  }
  