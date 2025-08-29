const createBlog = async (page, blog) => {
    await page.getByRole('button', {name:'New Blog'}).click()
    await page.getByPlaceholder('add title').fill(blog.title)
    await page.getByPlaceholder('add author').fill(blog.author)
    await page.getByPlaceholder('add url').fill(blog.url)
    await page.getByRole('button', {name:'Create'}).click()
    await page.getByText(`${blog.title} (${blog.author})`).waitFor()
}

const createBlogAPI = async (page, request, blog) => {

    // Get user token
    const loggedInUser = await page.evaluate(() => localStorage.getItem('loggedInUser'))
    const user = JSON.parse(loggedInUser)
    const token = user.token
    const headers = {Authorization: `Bearer ${token}`}

    // Create blog
    await request.post('/api/blogs', {
        headers:headers,
        data:blog
    })

}

export { createBlog, createBlogAPI }