const errorHandler = (error, request, response, next) => {
    console.error('error:', error.message)
    if (error.name === 'JsonWebTokenError') {
        console.log('JsonWebTokenError Triggered')
        return response.status(401).json({ error: `middleware - ${error.message}`})
    } else if (error.name === 'ValidationError') {
        return response.status(401).json({ error: `middleware - ${error.message}` })
    }
    next(error)
}

const getTokenFromRequest = (request, response, next) => {

    if (request.headers['authorization']) {
        const token = request.headers['authorization'].replace('Bearer ', '')
        request.token = token
    }
    
    next()
}

module.exports = { errorHandler, getTokenFromRequest }