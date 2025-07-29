import personService from '../services/persons'


const Person = ({person, persons, setPersons}) => {
  const deletePerson = (event) => {
    event.preventDefault()

    if (confirm(`Delete ${person.name}?`)) {
      personService
      .deletePerson(person.id)
      .then(() => {
        setPersons(persons.filter(x => x.id != person.id))
      })
    } else {
    }

  }

  return(
    <form onSubmit={deletePerson}>
      <div>{person.name} {person.number} <button type="submit">delete</button></div>
    </form>
  )
}

const Persons = ({persons, filter, setPersons}) => {
  return (
    persons
    .filter((x) => x.name.toLowerCase().includes(filter.toLowerCase()))
    .map(person => <Person key={person.name} person={person} persons={persons} setPersons={setPersons}/>)
  )
}

export default Persons