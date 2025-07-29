import { useState } from 'react'
import personService from '../services/persons'

const NewPersonForm = ({persons, setPersons, setMessage}) => {

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}

    const updatePerson = (newPerson) => {
      if (confirm(`${newPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
        .update(newPerson, persons)
        .then(response => {
          setPersons(persons.map(person => person.name != response.name ? person : response))
          setMessage({text:`Success! ${newPerson.name} updated`, sentiment:'positive'})
          setTimeout(() => {setMessage({text:'', sentiment:''})}, 5000)
        })
        .catch(error => {
          // Set error message
          setMessage({text:`Failure! ${newPerson.name} is not found`, sentiment:'negative'})
          setPersons(persons.filter(person => person.name != newPerson.name))
          // Update state to remove the absent note
        })
      } else {
      }

    }

    const addNewPerson = (newPerson) => {
      personService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response)) 
        setNewName('')
        setNewNumber('')
        setMessage({text:`Success! ${newPerson.name} added`, sentiment:'positive'})
        setTimeout(() => {setMessage({text:'', sentiment:''})}, 5000)
      })
    }

    const comparisonTest = x => x.name === newName
    persons.some(comparisonTest)
    ? updatePerson(newPerson)
    : addNewPerson(newPerson)
  }

  return (
    <form onSubmit={addPerson}>
      <div> name: <input value={newName} onChange={handleNameChange}/></div>
      <div> number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

export default NewPersonForm