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
      res.status(401).json({ message: "Auth error" });
    } else {
      // Add the user_id from the payload to the req object.
      req.user_id = payload.user_id;
      req.token = token; // Pass the token to the next middleware or route handler
      next();
    }
  });
};

// Function to extract userID from token
function getUserIdFromToken(token) {
  try {
    const decodedToken = JWT.decode(token); // Decode the token
    if (decodedToken && decodedToken.user_id) {
      return decodedToken.user_id; // Access the user_id from the decoded token payload
    }
    return null; // Return null if token is missing user_id or invalid
  } catch (error) {
    console.error("Error decoding token:", error);
    return null; // Return null in case of decoding errors
  }
}


module.exports = { tokenChecker, getUserIdFromToken }; // Export as an object with named properties
