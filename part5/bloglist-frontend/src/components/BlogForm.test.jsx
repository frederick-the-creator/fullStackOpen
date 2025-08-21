import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"


describe('Create new blog', () => {



    test('Create blog is called with correct details', async () => {

        const createBlog = vi.fn()
        render(<BlogForm createBlog={createBlog}/>)

        const user = userEvent.setup()
        const titleField = screen.getByPlaceholderText('add title')
        const authorField = screen.getByPlaceholderText('add author')
        const urlField = screen.getByPlaceholderText('add url')
        const button = screen.getByText('Create')

        await user.type(titleField, 'Macklemore wears a fur coat')
        await user.type(authorField, '50 Cent')
        await user.type(urlField, 'https://macklemoreIsAFurry')
        await user.click(button)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0].title).toBe('Macklemore wears a fur coat')
        expect(createBlog.mock.calls[0][0].author).toBe('50 Cent')
        expect(createBlog.mock.calls[0][0].url).toBe('https://macklemoreIsAFurry')
        // expect(createBlog.mock.calls[0][0].content).toBe('')

    })
})