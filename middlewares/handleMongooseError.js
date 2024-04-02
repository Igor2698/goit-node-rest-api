export const handleMongooseError = (error, data, next) => {
    const { name, code } = error;
    console.log(code)
    const status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    error.status = status;
    next()
};