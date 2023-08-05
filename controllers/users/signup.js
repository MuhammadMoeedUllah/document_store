
const {
    bodyParamValidator,
    dataBase, 
    createUserSession
} = require('../../components');

const bcrypt = require("bcrypt");

// required fields
const requiredFields = ["email", "password", "name"]

// check if username or email exist in the database
 const signUp = async (req, res) => {
 //search the database to see if user exist
 try {
    const validateParam = bodyParamValidator(requiredFields,req?.body)
    if(validateParam?.error === true){
        return res.status(validateParam.response.code).json({message: validateParam.response.message})
    }

    // check user email
   const user = await dataBase.user.findUnique({
    where: {email: req?.body?.email }
   });

    // check if user exists with password; Only happens when "guests" checkout an order
   if (user && user?.password) {
    return res.status(409).json({message: "user account already exists"});
  }

   const data = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
    };

    const userCreate = await dataBase.user.create({
        data
    });

    if (userCreate) {
        createUserSession(req, userCreate)
        return res.status(201).json({});
    }

   return res.status(503).json({message: "Something went wrong"});
 } catch (error) {
   console.log(error);
   return res.status(503).json({message: "Something went wrong"});
 }
};

//exporting module
 module.exports = {
    signUp
};