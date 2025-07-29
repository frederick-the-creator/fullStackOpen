import { useState } from 'react'
import CountryData from './CountryData'


const Countries = ({countries, filter}) => {
    const [showCountry, setShowCountry] = useState(null)
    const names = countries.map(country => country.name.common)
    const filteredNames = names.filter(name => {
        return name.toLowerCase().includes(filter.toLowerCase())
    }).sort()


    if (filteredNames.length === 1) {
        return (
            <CountryData name={filteredNames[0]} countries={countries}/>
        )
    } else if (filteredNames.length <= 10){        
        return (
            <div>
                {filteredNames.map(name => <div key={name}>{name} <button onClick={() => setShowCountry(name)}>Show</button></div>)}
                <CountryData name={showCountry} countries={countries}/>
            </div>
        )
    } else {
        return (
            <div>Too many matches, specify another filter</div>
        )
    }
}

export default Countries