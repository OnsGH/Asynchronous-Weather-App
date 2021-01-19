/* Global Variables */
let baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
let apiKey = "&appid=9ffb115a0a414734635dbd6b0a7733a4";
let unit = "&units=metric";

// Create a new date instance dynamically with JS
let d = new Date();
let month = d.getMonth() + 1;
let newDate = month + "." + d.getDate() + "." + d.getFullYear();
console.log("XXX date", d.getMonth());
document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
    e.preventDefault();
    const zipCode = document.getElementById("zip").value;
    const userFeelings = document.getElementById("feelings").value;

    getWeatherInfo(baseURL, zipCode, apiKey, unit).then(function (responseData) {
        console.log("all", responseData.success);
      /***
       * UpdateUI
       ***/
        if (responseData.success === false) {
            console.log("no success");
            updateUINoSuccess();
        } else {
            postData(
                "/addWeather",

                {
                    date: newDate,
                    cityName: responseData.weatherData.name,
                    temp: responseData.weatherData.main.temp,
                    icon: responseData.weatherData.weather[0].icon,
                    iconDesc: responseData.weatherData.weather[0].main,
                    weatherDescription: responseData.weatherData.weather[0].description,
                    feelings: userFeelings,
                }
            );
            updateUI();
        }
    });
   
}

const getWeatherInfo = async (baseURL, zipCode, apiKey, unit) => {
   
    try {
        const response = await fetch(baseURL + zipCode + apiKey + unit);
        let responseData = {};
        if (response.status === 200) {
            responseData = { success: true, weatherData: await response.json() };
            return responseData;
        } else {
            responseData = { success: false, error: response.statusText };
            return responseData;
        }
    } catch (error) {
        console.log(error);
        return { success: false, error: console.error.message };
    }
};

const postData = async (url = "", data = {}) => {
    console.log(data);
    console.log(url);
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log("try");
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

const updateUI = async () => {
    const request = await fetch("/all");

    try {
        const allData = await request.json();
        console.log("updateUI allData", allData);

        const msg = document.getElementById("msg");
        msg.textContent = "";

        const weatherCard = document.querySelector("section.main__grid");

        const icon = `https://openweathermap.org/img/wn/${allData.icon}@2x.png`;

        const div = document.createElement("div");
        div.classList.add("card");
        const markup = `
<div class='card__item'>
  <div class="city__name">
    <span>${allData.cityName}</span>
  </div>
  <div class="date">
     <span>${allData.date}</span>
  </div>
  <div class="city__temp">
     <span>${Math.round(allData.temp)}
    <sup>°C</sup>
    </span>
  </div>
  <figure>
    <img class="weather__icon" src=${icon} alt=${allData.iconDesc}>
    <figcaption>${allData.weatherDescription}</figcaption>
  </figure>
    <h3> Your feelings </h3>
    <p class="feelings__text"> ${allData.feelings}
    </p>
</div>
                
</div>
           
        
`;
        div.innerHTML = markup;
        weatherCard.appendChild(div);
    } catch (error) {
        console.log("error", error);
    }
};

function updateUINoSuccess(e) {
    const msg = document.getElementById("msg");
    msg.textContent = "Please search for a valid city in USA 😩";
}
