const bodyParamValidator = (requiredBody, requestBody) => {
    if (!requiredBody){
        return {error: true, response: {code: 422, message: 'Missing Parameters'}};
    }
    for (let _item of requiredBody  ){
        if (!(_item in requestBody)){
            return {error: true, response: {code: 422, message: 'Missing Parameters'}};
        }
    }
    return {error: false};
}
const removeIdColumns = (obj) => {
    for(prop in obj) {
        if (prop === 'id')
          delete obj[prop];
        else if (typeof obj[prop] === 'object')
        removeIdColumns(obj[prop]);
    }
}
module.exports = {bodyParamValidator, removeIdColumns}