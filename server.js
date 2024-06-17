const express = require("express");
const connectDB = require("./config/database");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors')

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));

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
    app.use("/api/articles", require("./routes/articleRoute"));

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
