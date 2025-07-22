const Person = ({person}) => <div>{person.name} {person.number}</div>

const Persons = ({persons, filter}) => {
  return (
    persons
    .filter((x) => x.name.toLowerCase().includes(filter.toLowerCase()))
    .map(person => <Person key={person.name} person={person}/>)
  )
}

export default Persons