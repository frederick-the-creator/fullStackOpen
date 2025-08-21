import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Initial state of blog', () => {

    beforeEach(() => {
        // Render component with props
        const blog = {
            author: "Santa Clause",
            title: "My Mrs Robinson",
            likes: "153",
            url: "https://mymrsrobinson.np",
            user: {
                id: '1'
            }
        }
        const user = {
            id: '1'
        }
        render(<Blog blog={blog} user={user}/>)
    })

    test('Display only title and author', () => {
        // Test that we can see the author and title
        const blogTitle = screen.getByText('My Mrs Robinson (Santa Clause)')
        expect(blogTitle).toBeDefined()
    })
    test('No display of url or likes', () => {
        // Test that we can't see the url and number of likes

        // // Implementation approach for visibility
        // const blogLike = container.querySelector(".urlLikes")
        // expect(blogLike).toHaveStyle('display: none')

        // Semantic approach for visibility
        const blogDetails = screen.getByText("likes 153")
        expect(blogDetails).not.toBeVisible()

        // // Semantic approach for rendering (doesn't check visibility)
        // const blogLike = screen.getByText("https://mymrsrobinson.np")
        // expect(blogLike).toBeDefined()

    })
})

describe('Blog interactivity', () => {

    test('Clicking View button reveals blog details', async () => {
        // Render component with props
        const blog = {
            author: "Santa Clause",
            title: "My Mrs Robinson",
            likes: "153",
            url: "https://mymrsrobinson.np",
            user: {
                id: '2'
            }
        }
        const blogUser = {
            id: '2'
        }
        render(<Blog blog={blog} user={blogUser}/>)

        const user = userEvent.setup()
        const button = screen.getByText("View")
        await user.click(button)

        const blogDetails = screen.getByText('likes 153')
        expect(blogDetails).toBeVisible()
    })

    test('Clicking Like button twice', async () => {

        // Create mock handler
        const mockHandler = vi.fn()
        
        // Render component with props
        const blog = {
            author: "Santa Clause",
            title: "My Mrs Robinson",
            likes: "153",
            url: "https://mymrsrobinson.np",
            user: {
                id: '2'
            }
        }
        const blogUser = {
            id: '2'
        }
        render(<Blog blog={blog} user={blogUser} addLike={mockHandler}/>)


        const user = userEvent.setup()
        const button = screen.getByText("Like")
        await user.click(button)
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})

