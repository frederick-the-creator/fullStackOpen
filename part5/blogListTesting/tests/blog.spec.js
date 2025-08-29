import { describe, test, expect, beforeEach } from "@playwright/test"
import { createBlog, createBlogAPI } from "./helper"

describe("Blog App Testing", () => {
    beforeEach( async ({ page, request }) => {

        // Initialise
        await request.post('/api/testing/initialise')

        // Create users
        const newUser1 = {
            username: 'gaia3',
            name: 'Gaia',
            password: 'smoke'
        }
        await request.post('/api/users/registration', {data: newUser1})

        // Navigate to home
        await page.goto('')
    })
    test("Show login form is available", async ({ page }) => {
        const loginButton = await page.getByText("User Login")
        await expect(loginButton).toBeVisible()
    })
    describe("Log in test", () => {
        test("Successful Login with correct credentials", async ({ page, request }) => {
            const user = {
                userName: 'gaia3',
                password: 'smoke'
            }
            await page.goto('')
            await page.getByPlaceholder('username').fill(user.userName)
            await page.getByPlaceholder('password').fill(user.password)
            await page.getByRole('button', {name:'Submit'}).click()
            
            await expect(page.getByText("gaia3 logged in")).toBeVisible()
        })
        test("Failed Login with incorrect credentials", async ({ page, request }) => {
            const user = {
                userName: 'gaia3',
                password: 'smoke1'
            }
            await page.goto('')
            await page.getByPlaceholder('username').fill(user.userName)
            await page.getByPlaceholder('password').fill(user.password)
            await page.getByRole('button', {name:'Submit'}).click()

            await expect(page.getByText("Login Failed")).toBeVisible()
        })
    })
    describe("When logged in", () => {
        beforeEach( async ({ page, request }) => {
            const user = {
                userName: 'gaia3',
                password: 'smoke'
            }
            await page.goto('')
            await page.getByPlaceholder('username').fill(user.userName)
            await page.getByPlaceholder('password').fill(user.password)
            await page.getByRole('button', {name:'Submit'}).click()
        })
        test("User can create new blog", async ({ page, request }) => {
            await page.getByRole('button', {name:'New Blog'}).click()
            await page.getByPlaceholder('add title').fill('Playwright Written Test')
            await page.getByPlaceholder('add author').fill('Playwright')
            await page.getByPlaceholder('add url').fill('https://playwright.org')
            await page.getByRole('button', {name:'Create'}).click()
            await page.getByText('Playwright Written Test (Playwright)').waitFor()
        })
        describe('When blog exists', () => {
            beforeEach( async ({ page }) => {
                const blog = {
                    title: "Playwright Written Test",
                    author: "Playwright",
                    url: "https://playwright.org"
                }
                await createBlog(page, blog)
            })
            test("User can like blog", async ({ page, request }) => {
                await page.getByRole('button', {name:'View'}).click()
                await page.getByRole('button', {name:'like'}).click()
                await expect(page.getByText('likes 1')).toBeVisible()
            })
            test("User can delete blog", async ({ page, request }) => {
                await page.getByRole('button', {name:'View'}).click()
                await page.getByRole('button', {name:'Delete'}).click()
                page.on('dialog', dialog => dialog.accept())
                await expect(page.getByText('Playwright Written Test (Playwright)')).not.toBeVisible()
            })
            test("Can't delete another user's blog", async ({ page, request}) => {
            
                // Create new user
                const newUser2 = {
                    username: 'fred3',
                    name: 'Fred',
                    password: 'fire'
                }
                await request.post('/api/users/registration', {data: newUser2})

                // Log out old user
                await page.getByRole('button', {name:'Log Out'}).click()

                // Log in new user
                const user = {
                    userName: 'gaia3',
                    password: 'smoke'
                }
                await page.goto('')
                await page.getByPlaceholder('username').fill(newUser2.username)
                await page.getByPlaceholder('password').fill(newUser2.password)
                await page.getByRole('button', {name:'Submit'}).click()

                // Fail to see delete button
                await page.getByRole('button', {name:'View'}).click()
                await expect(page.getByRole('button', {name:'Delete'})).not.toBeVisible()
            })
            test("Blogs arranged according to likes", async ({ page, request}) => {

                const blog1 = {
                    title: "Atlas",
                    author: "unknown",
                    url: "https:",
                    likes: 2
                }
                const blog2 = {
                    title: "Miros",
                    author: "unknown",
                    url: "https:",
                    likes: 5
                }
                const blog3 = {
                    title: "Trabson",
                    author: "unknown",
                    url: "https:",
                    likes: 3
                }

                await createBlogAPI(page, request, blog1)
                await createBlogAPI(page, request, blog2)
                await createBlogAPI(page, request, blog3)

                // Reload browser to fetch updated list of blogs 
                await page.reload()

                // Wait for network to be idle, which suggests app has finished rendering
                await page.waitForLoadState('networkidle')


                const likeRows = page.locator('.likes')
                await expect(likeRows).toHaveCount(4)

                const texts = await likeRows.allTextContents()     // e.g. ["likes 5Like", "likes 3Like", "likes 2Like"]
                const numbers = texts.map(t => parseInt((t.match(/\d+/) ?? ['0'])[0], 10))

                await expect(numbers).toEqual([5, 3, 2, 0])
                
            })

        })
    })
})