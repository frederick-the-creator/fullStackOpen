import { useState, useEffect } from 'react'
import restCountries from './services/restCountries'
import Countries from './components/countries'

const App = () => {

  // State variable that stores data on countries fetched from server
  // Use of conditional rendering and effect hook to accomodate component rendering behaviour


  const [countries, setCountries] = useState(null)

  useEffect(() => {
    console.log('fetching countries')
    restCountries
    .getAll()
    .then(response => {
      setCountries(response)
    })
  }, [])


  const [filter, setFilter] = useState('')
  const handleFilterUpdate = (event) => setFilter(event.target.value)

  if (!countries) {
    return null
  } else {
    return (
      <div>
        <div>find countries <input value={filter} onChange={handleFilterUpdate}></input></div>
        <Countries countries={countries} filter={filter}/>
      </div>
    )
    
  }
}

export default App
