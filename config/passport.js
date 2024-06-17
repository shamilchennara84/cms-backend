const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

// Import the User model 
const User = require("../models/usersModel");

// Retrieve the JWT secret key 
const jwtSecret = process.env.JWT_SECRET;

// Configure options for the JWT strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

// Passport JWT strategy for user authentication
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        // Find the user by ID from the JWT payload
        const user = await User.findById(jwtPayload.user);

        if (user) {
          // User found, return successful authentication
          return done(null, user);
        }

        // User not found, return failure
        return done(null, false);
      } catch (err) {
        // Handle errors during user lookup
        console.error(err);
        return done(err);
      }
    })
  );
};
