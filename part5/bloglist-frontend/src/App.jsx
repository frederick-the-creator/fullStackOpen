import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notificationMesssage, setNotificationMessage] = useState('')
    const [notificationSentiment, setNotificationSentiment] = useState('')

    const blogRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
        const storedUser = window.localStorage.getItem('loggedInUser')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            blogService.setToken(JSON.parse(storedUser).token)
        }

    }, [])

    const addBlog = async (newBlog) => {
        try {
            console.dir(newBlog, { depth:null })
            const savedBlog = await blogService.create(newBlog)
            setBlogs(blogs.concat(savedBlog))
            setNotificationMessage('Blog successfully added')
            setNotificationSentiment('positive')
            setTimeout(() => {
                setNotificationMessage('')
                setNotificationSentiment('')
            }, 5000)
            blogRef.current.handleToggle()
        } catch (error) {
            console.log('error:', error.message)
            setNotificationMessage('Failed to add blog')
            setNotificationSentiment('negative')
            setTimeout(() => {
                setNotificationMessage('')
                setNotificationSentiment('')
            }, 5000)
        }
    }

    return (
        <div>
            <Notification message={notificationMesssage} sentiment={notificationSentiment}/>
            <LoginForm
                user={user}
                setUser={setUser}
                setToken={blogService.setToken}
                setNotificationMessage={setNotificationMessage}
                setNotificationSentiment={setNotificationSentiment}
            />
            {user!==null &&
                <div>
                    <Togglable ref={blogRef}>
                        <BlogForm createBlog={addBlog}/>
                        <button onClick={() => blogRef.current.handleToggle()}>Cancel</button>
                    </Togglable>
                    <BlogList blogs={blogs} user={user} setBlogs={setBlogs}/>
                </div>
            }
        </div>
    )
}

export default App