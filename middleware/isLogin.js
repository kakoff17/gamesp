const { expressjwt: jwt } = require("express-jwt");

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", // recibe el payload despues de validarlo
  getToken: (req) => {
    if (!req.headers || !req.headers.authorization){
      //console.log("no tenemos token")
      return null
  }
    
    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0]
    const token = tokenArr[1]

    if(tokenType ==! "Bearer"){
      //console.log("token no válido")
      return null
    }
    //console.log("Token entregado correctamente")
    return token;
  }
})

module.exports = {
  isAuthenticated,
};
