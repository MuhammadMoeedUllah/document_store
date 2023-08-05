const jwt = require("jsonwebtoken");

const JWT_SESSION_TIMEOUT = process.env.JWT_EXPIRATION * 24 * 60 * 60 * 1000

const createUserSession = (req, user) =>{
    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRETKEY, {
        expiresIn: JWT_SESSION_TIMEOUT
     });

    req.session.user = {email: user.email, name: user.name, jwt: token, id: user.id}
}

const validateJwt = (jwtToken) =>{
    try {
        jwt.verify(jwtToken, JWT_SECRETKEY);
        return true;
    } catch (error) {
        return false;
    }
}
module.exports = {JWT_SESSION_TIMEOUT, createUserSession, validateJwt}