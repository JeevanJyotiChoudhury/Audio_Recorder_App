const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
const { audioRoutes } = require("./routes/audio.route");

const app = express();

app.use(express.json());
// app.use(cors());

const corsOptions = {
  origin: "*", // Allow requests from any origin
  methods: ["GET", "POST"], // Allow only GET and POST requests
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
};

app.use(cors(corsOptions));


// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://audio-recorder-app.vercel.app/"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use("/api/audios", audioRoutes);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Server running at port 8080");
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    console.log("Something went wrong");
  }
});
