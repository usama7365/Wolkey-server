require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const SignupRouter = require("./routes/signup.route");
const LoginRouter = require("./routes/Login.route");
const authRouter = require("./routes/auth.route");
const resetRouter = require("./routes/reset.route");
const generateSecretKey = require("./generateSecretKey");
const VerifyAccount = require("./routes/verify.account.route");
const protectedRoute = require("./routes/Protect.routes");
const AgencyRouter = require("./routes/Agency.route");
const videoRoutes = require("./routes/video.routes");
const adminRoute = require('./routes/Admin Routes/Admin.route')
const imageRoute = require("./routes/image.route")

const app = express();
app.use(express.json());
connectDB();
app.use(cors());

app.use(morgan("dev"));

const jwtSecretKey = generateSecretKey();
process.env.JWT_SECRET = jwtSecretKey;

const languageMapping = {
  US: "en",
  GR: "el",
};

app.use((req, res, next) => {
  try {
    const userCountryCode = "US";
    const userLanguage = languageMapping[userCountryCode] || "en";

    req.userLanguage = userLanguage;

    next();
  } catch (error) {
    console.error("Error detecting user language:", error);
    next();
  }
});

// Use Routes

app.use("/", SignupRouter);
app.use("/login", LoginRouter);
app.use("/auth", authRouter);
app.use("/reset", resetRouter);
app.use("/verify", VerifyAccount);

app.use("/", protectedRoute);

app.use("/", AgencyRouter);


app.use(express.static("public"));
app.use("/videos", videoRoutes);

app.use("/", imageRoute);




//Admin Routes

app.use("/admin", adminRoute);



// Serve static files from the "public/uploads" directory
// app.use('/uploads', express.static('public/uploads'));

// if (process.env.NODE_ENV === "PRODUCTION") {
//   app.use(express.static("client-react/build"));
//   app.use(express.static(path.join(__dirname, "./uploads")));

//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "client-react", "build", "index.html")
//     );
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
