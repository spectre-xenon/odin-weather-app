async function getWeatherData(city) {
  const apiKey = "6e2106aa1f064a8181892936232310";

  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`
  );

  if (response.status === 400) {
    alert("city is invalid");
    return;
  }

  return response.json();
}

async function renderDOM(city) {
  const data = await getWeatherData(city);
  console.log(data);

  // Set body background
  const body = document.querySelector("body");
  const date = data.location.localtime.split(" ");
  const hour = parseInt(date[1].slice(0, 2));

  if (hour <= 12 && hour >= 6) {
    body.style.backgroundImage = "var(--morning)";
  } else if (hour <= 18 && hour >= 1) {
    body.style.backgroundImage = "var(--afternoon)";
  } else {
    body.style.backgroundImage = "var(--night)";
  }

  // Current day
  document.getElementById("skyStatus").textContent =
    data.current.condition.text;
  document.getElementById(
    "city"
  ).textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById("temp").textContent = `${data.current.temp_c} °C`;
  document.getElementById(
    "chanceOfRain"
  ).textContent = `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  document.getElementById(
    "windSpeed"
  ).textContent = `${data.current.wind_kph} kph`;
  document.getElementById(
    "feelsLike"
  ).textContent = `${data.current.feelslike_c} °C`;

  // Humidity
  const humidityIcon = document.getElementById("humidityIcon");

  if (data.current.humidity > 60) {
    humidityIcon.textContent = "humidity_high";
  } else if (data.current.humidity <= 60 && data.current.humidity >= 40) {
    humidityIcon.textContent = "humidity_mid";
  } else {
    humidityIcon.textContent = "humidity_low";
  }
  document.getElementById("humidity").textContent = `${data.current.humidity}%`;

  // Current day weather icon
  const weatherCodes = {
    1000: "sunny",
    1003: "partly_cloudy_day",
    1006: "cloud",
    1030: "mist",
    1063: "rainy_light",
    1183: "rainy_light",
    1066: "snowing",
    1069: "rainy_snow",
    1087: "bolt",
    1117: "severe_cold",
    1135: "foggy",
    1189: "rainy",
    1195: "rainy_heavy",
    1213: "snowing",
    1219: "weather_snowy",
    1225: "snowing_heavy",
    1276: "thunderstorm",
    1009: "foggy",
  };

  document.getElementById("currentIcon").textContent =
    weatherCodes[data.current.condition.code] || "partly_cloudy_day";
  // Forecast
  const forcastContainerDiv = document.getElementById("forcastContiner");

  forcastContainerDiv.textContent = "";

  data.forecast.forecastday.forEach((forecastData) => {
    const forcastDiv = document.createElement("div");

    const transparentDiv = document.createElement("div");
    const icon = document.createElement("img");
    const temp = document.createElement("p");

    const day = document.createElement("p");

    forcastDiv.classList.add("forcast");
    transparentDiv.classList.add("transparentBox");
    icon.classList.add("material-symbols-rounded");
    temp.classList.add("temp");
    day.classList.add("day");

    icon.src = forecastData.day.condition.icon;
    temp.textContent = `${forecastData.day.avgtemp_c} °C`;
    day.textContent = new Date(forecastData.date).toLocaleDateString("en", {
      weekday: "long",
    });

    forcastDiv.appendChild(transparentDiv);
    forcastDiv.appendChild(day);

    transparentDiv.appendChild(icon);
    transparentDiv.appendChild(temp);

    forcastContainerDiv.appendChild(forcastDiv);
  });
}

document.getElementById("queryWeather").addEventListener("keydown", (event) => {
  if (event.target.value === "") return;
  event.key === "Enter" ? renderDOM(event.target.value) : null;
});

renderDOM("cairo");
