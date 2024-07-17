const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
    
    try {
   
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { username, userId } = decode;
    req.userId = userId
    req.username = username;
    next()
  } catch (error) {
     
    next("Authentication failure!")
  }
};

module.exports = checkLogin;
