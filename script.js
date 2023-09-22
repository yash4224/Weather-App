const userWeather=document.querySelector("[data-userWeather]");
const searchWeather=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingContainer=document.querySelector(".loading-container");
const userInfo=document.querySelector(".user-info-container");

let API_KEY="a68880b5a227b65564a51ee195e839ac";
let currentTab=userWeather;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            grantContainer.classList.remove("active");
            userInfo.classList.remove("active");
            searchForm.classList.add("active");
        }
        // if you are at searchform tab and want to switch at yourweather tab
        else{
            searchForm.classList.remove("active");
            userInfo.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userWeather.addEventListener('click', ()=>{
    switchTab(userWeather);
});

searchWeather.addEventListener('click', ()=>{
    switchTab(searchWeather);
});

// check if corrdinates are already present in session storage
function getfromSessionStorage(){
    const local= sessionStorage.getItem("user-coordinates");
    if(!local){
        grantContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(local);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantContainer.classList.remove("active");
    // make loading visible
    loadingContainer.classList.add("active");

    // api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // now remove loadingcontainer
        loadingContainer.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err){
        loadingContainer.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo){
    // first we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryFlag=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temperature=document.querySelector("[data-temp]");
    const wind=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-clouds]");  

    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    wind.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active");
    userInfo.classList.remove("active");
    grantContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}