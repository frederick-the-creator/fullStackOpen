import { useState } from 'react'
import loginService from '../services/login'
import PropTypes from 'prop-types'

const LoginForm = ({ user, setUser, setToken, setNotificationMessage, setNotificationSentiment }) => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const submitLogin = async (event) => {
        event.preventDefault()
        try {
            const response = await loginService.userLogin({ userName, password })
            console.log('respnose', response)
            setUser(response)
            setUserName('')
            setPassword('')
            setToken(response.token)
            setNotificationMessage('Login Successful!')
            setNotificationSentiment('positive')
            setTimeout(() => {
                setNotificationMessage('')
                setNotificationSentiment('')
            }, 5000)
            window.localStorage.setItem(
                'loggedInUser', JSON.stringify(response)
            )
        } catch (error) {
            console.log('error', error.message)
            setNotificationMessage('Login Failed')
            setNotificationSentiment('negative')
            setTimeout(() => {
                setNotificationMessage('')
                setNotificationSentiment('')
            }, 5000)
        }
    }

    const submitLogout = async (event) => {
        event.preventDefault()
        try {
            window.localStorage.removeItem('loggedInUser')
            setUser(null)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {Object.keys(user).length === 0 ?
                <div>
                    <h2>User Login</h2>
                    <form onSubmit={submitLogin}>
                        <div>
                            Username:
                            <input type="text" value={userName} placeholder='username' onChange={({ target }) => setUserName(target.value)}/>
                        </div>
                        <div>
                            Password:
                            <input type="text" value={password} placeholder='password' onChange={({ target }) => setPassword(target.value)}/>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div> :
                <div>
                    <form onSubmit={submitLogout}>
                        {user.username} logged in
                        <button type='submit'>Log Out</button>
                    </form>
                </div>
            }
        </div>
    )
}

LoginForm.propTypes = {
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    setNotificationMessage: PropTypes.func.isRequired,
    setNotificationSentiment: PropTypes.func.isRequired
}

export default LoginForm