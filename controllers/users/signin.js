const{
    bodyParamValidator, 
    dataBase, 
    createUserSession} = require('../../components')

const bcrypt = require("bcrypt");

// required fields
const requiredFields = ["email", "password"]

// check if username or email exist in the database
 const signIn = async (req, res) => {
 //search the database to see if user exist
 try {
    if (req.session?.user?.id){
        return res.status(200).json({message: "User already Signedin"});
    }
    const validateParam = bodyParamValidator(requiredFields,req?.body)
    if(validateParam?.error === true){
        return res.status(validateParam.response.code).json({message: validateParam.response.message})
    }

    // check user email
    const user = await dataBase.user.findUnique({
        where: {email: req?.body?.email }
    });

    // check if user exists without password; Only happens when "guests" checkout an order
    if (!user?.password) {
        return res.status(409).json({message: "user account DoesNotExist"});
    }
    const isSame = await bcrypt.compare(req.body.password, user.password);
    if (isSame) {
       createUserSession(req, user)
       return res.status(200).json({message: "login Successful"});
    }
    return res.status(401).json({message: "Invalid username or password"});
 } catch (error) {
   console.log(error);
   return res.status(503).json({message: "Something went wrong"});
 }
};

//exporting module
 module.exports = {
    signIn
};