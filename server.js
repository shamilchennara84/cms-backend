const express = require("express");
const connectDB = require("./config/database");
const passport = require("passport");
const dotenv = require("dotenv");

// Load environment variables 
dotenv.config();

// Initialize Express app
const app = express();

async function startServer() {
  try {
    await connectDB();

    // Middleware to parse JSON bodies
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Passport middleware
    app.use(passport.initialize());

    // Passport configuration 
    require("./config/passport")(passport);

    // Routes
    app.use("/api/users", require("./routes/usersRoute"));
    // app.use("/api/articles", require("./routes/articles")); 

    // Default route for testing the server
    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process on error
  }
}

startServer();
