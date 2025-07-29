import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (newPerson, persons) => {
    const person = persons.find(x => x.name == newPerson.name)
    const id = person.id
    const changedPerson = {...person, number: newPerson.number }
    const url = `${baseUrl}/${id}`
    const request = axios.put(url, changedPerson)
    return request.then(response => response.data)
}

export default {getAll, create, deletePerson, update}