# Weather_Forcast_Application
# Introduction
The Weather Forecast Application is a web-based tool that provides weather information for any city. It uses the WeatherAPI to fetch and display the current weather conditions and a forecast for the next six days. The application also supports light and dark themes and can remember the last searched cities.
# Features
1. Fetch weather data for any city using WeatherAPI.
2. Display current weather conditions and a six-day forecast.
3. Light and dark theme toggle with the last used theme saved in local storage.
4. Save and display the last five searched cities.
5. Use the current location to fetch weather data.
# Setup and Installation
1. Clone the Repository
command- git clone https://github.com/syaloni06/Weather_Forcast_Application.git
cd Weather_Forcast_Application
2. Install Dependencies
Ensure you have Node.js and npm installed.
command- npm install
3. Build Tailwind CSS
  a. Install tailwindcss via npm, and create your tailwind.config.js file.
    npm install -D tailwindcss
    npx tailwindcss init
  b. Add the paths to all of your template files in your tailwind.config.js file.
    module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {},
    },
    plugins: [],
   }
  c. Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  d. Run the CLI tool to scan your template files for classes and build your CSS.
     npx tailwindcss -i ./src/input.css -o ./public/output.css --watch
  e. Add your compiled CSS file to the <head> and start using Tailwind’s utility classes to style your content.
     <link href="./output.css" rel="stylesheet">
4.Run the Application
5.Open the index.html file in your web browser.
# Usage
1. Search for a City - Enter the city name in the input field and click the "Search" button.
2. Use Current Location - Click the "Use Current Location" button to fetch weather data for your current location.
3. Theme Toggle - Click the moon/sun icon in the top-right corner to toggle between light and dark themes. The selected theme will be saved for future visits.
4. View Last Searched Cities - The last five searched cities are saved and can be selected from a dropdown menu.
