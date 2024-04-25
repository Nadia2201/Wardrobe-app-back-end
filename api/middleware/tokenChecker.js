const JWT = require("jsonwebtoken");
 
// Middleware function to check for valid tokens
const tokenChecker = (req, res, next) => {
  let token;
  const authHeader = req.get("Authorization");
 
  if (authHeader) {
    token = authHeader.slice(7);
  }
 
  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.status(401).json({ message: "auth error" });
    } else {
      // Add the user_id from the payload to the req object.
      req.user_id = payload.user_id;
      next();
    }
  });
};
 
// Function to extract userID from token
function getUserIdFromToken(token) {
  const decodedToken = JWT.decode(token); // Decode the token
  if (decodedToken) {
    return decodedToken.userId; // Access the userID from the decoded token payload
  }
  return null; // Return null if token is invalid or missing
};
 
module.exports = { tokenChecker, getUserIdFromToken } ; // Export as an object with named properties and add a semicolon