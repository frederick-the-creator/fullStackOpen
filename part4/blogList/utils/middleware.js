const errorHandling = (error, request, response, next) => {
    return response.status('400').json({error: error.message})
}