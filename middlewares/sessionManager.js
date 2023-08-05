const jwt = require("jsonwebtoken");


const validateJwt = (req, res, next) => {
    if (!req.session?.user?.id){
        return res.status(403).json({message:"Unauthorized Exception"})
    }
    console.log(req.session);
    next();
}
module.exports = {validateJwt}