function swaggerFailAction(request, source, error) {
    try {
        let customErrorMessage = '';
    if (error.output.payload.message.indexOf('[') > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf('['));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation;
    return error
    }
    catch (e) {
        console.log(e)
    }
}

function sendSuccess(resp) {
    let statusCode =  200
    let message = 'SUCCESS'

    if(typeof resp.statusCode === 'number' && !isNaN(Number(resp.statusCode))) {
        statusCode = resp.statusCode
        delete resp.statusCode
    }

    if(typeof resp.message === 'string') {
        statusCode = resp.message
        delete resp.message
    }

    const data = resp || {}
    return {
        statusCode,
        message,
        data
    };
}

module.exports = {
    swaggerFailAction,
    sendSuccess
}