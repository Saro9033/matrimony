module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    let message = err.message;
    let error = new Error(message)

    if(err.name == "ValidationError") {
        console.log("Validate : ",err.name)
        message = Object.values(err.errors).map(value => value.message)
        error = new Error(message)
    }

    if(err.name == 'CastError'){
        message = `Resource not found : ${err.path}`
        error = new Error(message)
    }

    if(err.code == 11000){
        message = `Duplicate ${Object.keys(err.keyValue)} error`
        error = new Error(message)
    }

    if(err.name == "JSONWebTokenError"){
        message = `JSON Web Token is invalid. Try again`
        error = new Error(message)
    }

    if(err.name == "TokenExpiredError"){
        message = `JSON Web Token is Expired. Try again`
        error = new Error(message)
    }

    if(err.code == "LIMIT_UNEXPECTED_FILE"){
        message = `Upload Single File. Try again`
        error = new Error(message)
    }

    if(err.code == "LIMIT_FILE_SIZE"){
        message = `File size exceeds the 2MB limit`
        error = new Error(message)
    }

    res.status(err.statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        //Development
       stack: err.stack,
      error:err
    })

}