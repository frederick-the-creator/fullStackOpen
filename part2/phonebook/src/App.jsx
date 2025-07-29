import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import NewPersonForm from './components/NewPersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({text: '', sentiment: 'negative'})

  const instantiatePersons = () => personsService.getAll().then(response => setPersons(response))
  useEffect(() => instantiatePersons, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter setFilter={setFilter}/>
      <h2>add a new</h2>
      <NewPersonForm persons={persons} setPersons={setPersons} setMessage={setMessage}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} setPersons={setPersons}/>
    </div>
  )
}

export default App 