const { createLogger, transports } = require('winston');
const { AppError } = require('./app-errors');


const logErrors = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app_error.log' })
    ]
});


class ErrorLogger {
    constructor() {}
    async logError(err) {
        console.log('========== Start Error Logger ============');
        logErrors.log({
            private: true,
            level: 'error',
            message: `${new Date()}-${JSON.stringify(err)}`
        });
        console.log('================ End Error Logger =============');

        return false;
    }

    isTrustError(error) {
        if(error instanceof AppError) {
            return error.isOperational;
        } else {
            return false;
        }
    }
}


const ErrorHandler = async(err, req, res, next) => {

    const errorLogger = new ErrorLogger();

    process.on('uncaughtException', (reason, promise) => {
        console.log(reason, 'UNHANDLED');
        throw reason;
    })

    //console.log(err.description, '------> DESCRIPTION');
    //console.log(err.message, '--------> MESSAGE');
    //console.log(err.name, '--------->NAME');

    if(err) {
        await errorLogger.logError(err);
        if(errorLogger.isTrustError(err)) {
            if(err.erroStack) {
                const errorDescription = err.erroStack;
                return res.status(err.statusCode).json({'message': errorDescription });
            }
            return res.status(err.statusCode).json({ 'message': err.message })
        } else {
            //process exit //terriablly wrong with flow need restart
        }
        return res.status(500).json({'message': err.message })
    }
    next();
}

module.exports = ErrorHandler;