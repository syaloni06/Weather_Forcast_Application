# Weather_Forcast_Application
The Weather Forecast Application is a web-based tool that provides weather information for any city. It uses the WeatherAPI to fetch and display the current weather conditions and a forecast for the next six days. The application also supports light and dark themes and can remember the last searched cities.
## Features
1. Fetch weather data for any city using WeatherAPI.
2. Display current weather conditions and 5-days forecast.
3. Light and dark theme toggle with the last used theme saved in local storage.
4. Save and display the last five searched cities.
5. Use the current location to fetch weather data.
## Setup and Installation
1. `Clone` the Repository
``` bash
git clone https://github.com/syaloni06/Weather_Forcast_Application.git
cd Weather_Forcast_Application
```
2. Install Dependencies
Ensure you have `Node.js` and `npm` installed.
``` bash
npm install
```
3. Build Tailwind CSS
- Install tailwindcss via npm, and create your `tailwind.config.js` file.
``` bash
npm install -D tailwindcss
npx tailwindcss init
```
- Add the paths to all of your template files in your `tailwind.config.js` file.
``` bash
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './index.html','./index.js', // Adjust this to your file structure
    './*.html', // Ensure it scans your HTML files
  ],
  theme: {
    extend: {
      boxShadow: {
        'b': '0 0 20px 1px rgba(0,0,0,0.1)',
        '3xl': '0 0 40px 3px rgba(0,0,0,0.1)',
      },
      keyframes: {
        moveLeftRight: {
          '0%': { transform: 'translateX(-20px)' }, // Start from the left
          '50%': { transform: 'translateX(20px)' }, // Move to the right
          '100%': { transform: 'translateX(-20px)' }, // Move back to the left
        },
        moveLR: {
          '0%': { transform: 'translateX(-10px)' }, // Start from the left
          '50%': { transform: 'translateX(10px)' }, // Move to the right
          '100%': { transform: 'translateX(-10px)' }, // Move back to the left
        },
      },
      animation: {
        moveLeftRight: 'moveLeftRight 6s infinite linear',
        moveLR: 'moveLR 6s infinite linear',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['hover'],
    },
  },
  plugins: [],
}
```
- Add the `@tailwind` directives for each of Tailwind’s layers to your main CSS file.
``` bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- Run the CLI tool to scan your template files for classes and build your CSS.
``` bash
npx tailwindcss -i ./input.css -o ./output.css --watch
```
- Add your compiled CSS file to the `<head>` and start using Tailwind’s utility classes to style your content.
``` bash
<link href="./output.css" rel="stylesheet">
```
4. Run the Application
5. Open the index.html file in your web browser.
## Usage
1. Search for a City - Enter the city name in the input field and click the "Search" button.
2. Use Current Location - Click the "Use Current Location" button to fetch weather data for your current location.
3. Theme Toggle - Click the moon/sun icon in the top-right corner to toggle between light and dark themes. The selected theme will be saved for future visits.
4. View Last Searched Cities - The last five searched cities are saved and can be selected from a dropdown menu.
## Project Demo
### Deployed link - https://syaloni06.github.io/Weather_Forcast_Application/
https://github.com/user-attachments/assets/d0052b45-ea2f-479d-be20-2e909b40a149
