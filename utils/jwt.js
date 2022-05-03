const jwt = require('jsonwebtoken');

const parseJWt = (token) => {
    try {
        const decoded =  jwt.verify(token, 'shhhhh');
        return decoded
    } catch (error) {
        return null
    }
}


module.exports = {
    parseJWt
}