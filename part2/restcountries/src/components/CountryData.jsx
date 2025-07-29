import { useState, useEffect } from 'react'
import getWeather from '../services/weather'


/*
Problem - Works when only one match but not when multiple matches
Problem - Calling effect within an if statement
- I need to call the API to fetch the temp and wind speed
- I can't access the output of the API, so I need to set the variables for temp and wind through state variables in the promise
- As I am setting state variables, I need to do this from an effect instead of a function call else I will have an infinite loop
- I can't call the effect outside the if statement as it needs to work with the capital city and this is not available if name is null
*/

const CountryData = ({name, countries}) => {
    const [temp, setTemp] = useState(null)
    const [wind, setWind] = useState(null)

    const country = name ? countries.find(country => country.name.common.toLowerCase().includes(name.toLowerCase())) : null


    // Call this function using effect as it updates the state variables which if called directly would result in infinite loop
    const cityWeather = (country) => {
        getWeather(country.capital)
        .then(response => {
            const {main, wind} = response
            setTemp(main.temp)
            setWind(wind.speed)
        })
    }

    useEffect(() => {
        if (country) {
            cityWeather(country)
        }
    },[name])

    if (name === null) {
        return null
    } else {
    

        // Call this function directly as it returns the divs
        const countryLanguages = (country) => {
            return Object.entries(country.languages).map(([code, name]) => (
                <li key={code}>{name}</li>
            ))
        }

        const flagStyle = {fontSize: '300px'}

        return (
            <div>
                <h1>{country.name.common}</h1>
                <div>Capital {country.capital}</div>
                <div>Area {country.area}</div>
                <h2>Languages</h2>
                <ul>{countryLanguages(country)}</ul>
                <div style={flagStyle}>{country.flag}</div>
                <h2>Weather in {country.capital}</h2>
                <div>Temperature {temp} Celsius</div>
                <div>Wind {wind} m/s</div>
            </div>
        )
    }
}

export default CountryData