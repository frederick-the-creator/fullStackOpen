import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogUrl, setNewBlogUrl] = useState('')

    const handleAddBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newBlogTitle,
            author: newBlogAuthor,
            url: newBlogUrl
        })
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
    }


    return (
        <div>
            <h2>Add New Blog</h2>
            <form onSubmit={handleAddBlog}>
                <div>
                    Title:
                    <input type='text' placeholder="add title" value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)}></input>
                </div>
                <div>
                    Author:
                    <input type='text' placeholder="add author" value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)}></input>
                </div>
                <div>
                    Url:
                    <input type='text' placeholder="add url"value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)}></input>
                </div>
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}

export default BlogForm