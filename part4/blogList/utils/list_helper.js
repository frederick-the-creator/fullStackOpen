const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogList) => {
    // Reduce to loop through array and sums the likes
    // Return total sum

    const sumReducer = (sum, item) => {
        return sum + item.likes
    }

    return totalSum = blogList.reduce(sumReducer, 0)
}

const favoriteBlog = (blogList) => {

    // Identify largest number of likes
    console.log('Bloglist object type', Object.prototype.toString.call(blogList))
    const likesList = Object.entries(blogList).map(blog => Number(blog.likes))
    const maxLikes = Math.max(...likesList)
    
    // Identify blog with that number
    const maxLikesBlog = Object.entries(blogList).find(blog => Number(blog.likes) === maxLikes)
    return maxLikesBlog

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}