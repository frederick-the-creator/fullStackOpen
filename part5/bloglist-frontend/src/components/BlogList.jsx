import Blog from './Blog'

const BlogList = ({ blogs, setBlogs, user }) => {

    // console.log('blogs pre-sort', blogs)
    blogs.sort((a,b) => b.likes - a.likes)
    // console.log('blogs post-sort', blogs)

    return (
        <div>
            <h2>blogs</h2>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} user={user} blogs={blogs} setBlogs={setBlogs}/>
            )}
        </div>
    )
}

export default BlogList