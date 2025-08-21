import Blog from './Blog'

const BlogList = ({ blogs, setBlogs, user }) => {

    const addLike = () => {
        const newBlog = {
            ...blogDetails,
            likes: blogDetails.likes + 1
        }
        blogService.addLike(newBlog)
        setBlogDetails(newBlog)
    }

    return (
        <div>
            <h2>blogs</h2>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} user={user} blogs={blogs} setBlogs={setBlogs} addLike={addLike}/>
            )}
        </div>
    )
}

export default BlogList