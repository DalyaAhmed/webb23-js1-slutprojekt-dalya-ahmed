//The code retrieves weather data and forecast data from the OpenWeatherMap API, processes the data, and displays it in the search results div on the web page

const form = document.querySelector('form');
const input_City = document.querySelector('input');
const searchResultDiv = document.querySelector('#container');
const forecostWeathrDiv = document.querySelector('#forecost-weather');
const errorH3 = document.querySelector('#error');

// Se över variabelnamn så att alla beskriver vad de innehåller




//The `addEventListener` method is used to listen for a form submission event. When the event is triggered, the `event.preventDefault()` method is called to prevent the default form submission behavior.
form.addEventListener('submit', function (event) {
    event.preventDefault();

    searchResultDiv.innerHTML = '';
    errorH3.innerText = '';



//It  extracts some data from the user input and creates an HTTP request URL using the `fetch()` function. This URL is then used to make an HTTP request to retrieve weather data for a specific city from the OpenWeatherMap API.   
    const api_Key = 'a2767fa148b04c95c868513a4fdf07cf';

    
    const city = input_City.value;
    const cityName = document.createElement('h1');
    cityName.innerText = city;
    cityName.style.margin = "10px";
    searchResultDiv.append(cityName)
    form.reset();

    const hoursSelect = document.querySelector('#hoursSelect');
    let hours = hoursSelect.value;
    hoursSelect.addEventListener('change', function () {
        hours.this.value;
    });

    const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_Key}`;

    fetch(cityUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw 'Something went wrong';
            }
        })
//Once the weather data is retrieved, the `displayWeatherInfo()` function is called to populate the search results div with the appropriate weather information.        
        .then(data => {
            displayWthearInfo(data)
            const lat = data.coord.lat;
            const lon = data.coord.lon;

//The code then extracts the latitude and longitude coordinates of the city from the weather data and constructs another HTTP request URL to retrieve forecast data for the same city. This second URL is also used to make an HTTP request to the OpenWeatherMap AP            
const forecastUrl=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=${hours}&appid=${api_Key}`;  
            //const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}&units=metric&cnt=${hours}`;
            //const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}&units=metric`;

            return fetch(forecastUrl);
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw 'Something went wrong';
            }

        })
//Once the forecast data is retrieved, the `displayForecasts()` function is called to populate the search results div with the forecast data.        
        .then(displayForecasts)

//if any errors occur during the HTTP requests, the `handleError()` function is called to display the error message in the error h3 element.
        .catch (handleError);
})


function displayWthearInfo(data) {
    console.log(data);

    const temperatureInCelsius = data.main.temp;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;
    const iconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;

    const temperatureParagraph = document.createElement('h2');
    temperatureParagraph.innerText = ` ${temperatureInCelsius.toFixed(2)} °C`;
    searchResultDiv.append(temperatureParagraph)

    const windholder = document.createElement('h');
    windholder.innerText = `Wind speed: ${windSpeed} km/h`
    searchResultDiv.append(windholder);

    const decriptionHolder = document.createElement('h3');
    decriptionHolder.innerText = `Desciption: ${weatherDescription} `;
    searchResultDiv.append(decriptionHolder);

    const iconImg = document.createElement('img');
    iconImg.src = iconUrl;
    searchResultDiv.append(iconImg);
    



//The background image will be changed according to the wthear condition
    const body = document.querySelector('body');

  if (weatherDescription.includes('cloud')) {
    body.style.backgroundImage = 'url(clouds.jpg)';
  } else if (weatherDescription.includes('sun') || weatherDescription.includes('clear')) {
    body.style.backgroundImage = 'url(sunny.jpg)';
  } else if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle')) {
    body.style.backgroundImage = 'url(drizzle.jpg)';
  } else if (weatherDescription.includes('snow')) {
    body.style.backgroundImage = 'url(snow.jpg)';
  } else {
    body.style.backgroundImage = 'url(clear.jpg)';
  }
}

function displayForecasts(data) {
    
    const forecasts = data.list;
  
    forecasts.forEach((forecast) => {
   
      const temperature = forecast.main.temp;
      const weatherIcon = forecast.weather[0].icon;
      const forecastTime = new Date(forecast.dt * 1000).toLocaleString(); // Expected output: "11/06/2023, 03:00:00"
      const weatherDescription = forecast.weather[0].description;
  
      const forecastDiv = document.createElement("div");
      forecastDiv.classList.add("forecast");
      forecastDiv.style.margin = '30px';
  
      const temperatureParagraph = document.createElement("p");
      temperatureParagraph.innerText = `${temperature.toFixed(1)} °C`;
      forecastDiv.append(temperatureParagraph);
  
      const decriptionHolder = document.createElement("p");
      decriptionHolder.innerText =  weatherDescription ;
      forecastDiv.append(decriptionHolder);
  
      const iconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;
      const iconImg = document.createElement("img");
      iconImg.src = iconUrl;
      forecastDiv.append(iconImg);
  
      const timeParagraph = document.createElement("p");
      timeParagraph.innerText = forecastTime;
      forecastDiv.append(timeParagraph);
  
      forecostWeathrDiv.append(forecastDiv);
    });
  }

function handleError(error) {
    errorH3.innerText = error;
}