import axios from 'axios'
const baseUrl = '/api/users'

const userLogin = async (userCredentials) => {
    console.log('request sent to: ', `${baseUrl}/login`)
    console.log('user credentials to send:', userCredentials)
    const request = await axios.post(`${baseUrl}/login`, userCredentials)
    console.log('response', request.data)
    return request.data
}

export default { userLogin }