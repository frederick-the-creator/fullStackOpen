import { useState } from 'react'

const NewPersonForm = ({persons, setPersons}) => {

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
    
    const comparisonTest = (currentElement) => currentElement.name === newName

    const updatePersons = (newPerson) => {
      setPersons(persons.concat(newPerson)) 
      setNewName('')
      setNewNumber('')
    }

    const newPerson = {name: newName, number: newNumber}

    persons.some(comparisonTest)
    ? alert(`${newName} is already added to the phonebook`)
    : updatePersons(newPerson)
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