import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_API_KEY
console.log('api_key: ', api_key)

const geoCoding = (city) => {
    const request = axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api_key}`)
    return request.then(response => response.data[0])
}

const getWeather = (city) => {
    return (
        geoCoding(city)
        .then(response => {
            const {lat, lon} = response
            const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
            return request.then(response => response.data)
        })
    )
}

// getWeather('London').then(response => console.log(response))

export default getWeather