import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, blogs, setBlogs }) => {
    const [hideToggle, setHideToggle] = useState(true)
    const [blogDetails, setBlogDetails] = useState(blog)

    const visibility = { display: hideToggle===false ? '' : 'none' }
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleToggle = () => {
        setHideToggle(!hideToggle)
    }

    const deleteBlog = () => {
        window.confirm(`Are you sure you want to delete ${blogDetails.name}`)
        try {
            blogService.deleteBlog(blogDetails)
            const newBlogs = blogs.filter(blog => blog.id!==blogDetails.id)
            setBlogs(newBlogs)
        } catch (error) {
            console.log('error', error)
        }
    }

    const addLike = () => {
        const newBlog = {
            ...blogDetails,
            likes: blogDetails.likes + 1
        }
        blogService.addLikesService(newBlog)
        setBlogDetails(newBlog)
    }

    console.log('user id', user.id)
    console.log('blog details', blogDetails)
    console.log('blog details user id', blogDetails.user.id)
    
    return (
        <div style={blogStyle} className='blog'>
            {blogDetails.title} ({blogDetails.author})
            <button onClick={() => handleToggle()}>View</button>
            <div style={visibility} className="urlLikes">
                <div>{blogDetails.url}</div>
                <div className="likes">
                    likes {blogDetails.likes}
                    <button onClick={addLike}>Like</button>
                </div>
                <div>
                    {user.id===blogDetails.user.id &&
                        <button onClick={deleteBlog}>Delete</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Blog