require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset.js");
const updateProfileRoutes = require("./routes/updateProfile.js");
const cropRecommendationRoutes = require("./routes/cropRec.js");
const notesRoutes = require("./routes/notes.js");
const quizRoutes = require("./routes/quiz.js");
const feedbackRoutes = require("./routes/feedback.js");
const complaintRoutes = require("./routes/complaint.js");
const dashboardRoutes = require("./routes/dashboard.js");
const videoRoutes = require("./routes/videos.js");
const postRoutes = require("./routes/posts.js");
const locationRoutes = require("./routes/locations.js");
const modelCostRoutes = require("./routes/modelcosts.js");
const floodModelRoutes = require("./routes/floodmodels.js");
const postModModelRoutes = require("./routes/postmoderation.js");
const prefloodchecklistRoutes = require("./routes/prefloodChecklist.js");
const postfloodchecklistRoutes = require("./routes/postfloodChecklist.js");

// database connection
connection();

// middlewares
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const assetsPath = path.join(__dirname, "../client/public/assets");

app.use("/assets", express.static(assetsPath));

// routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/update-profile", updateProfileRoutes);
app.use("/api/crop-recommendation", cropRecommendationRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/postmoderation", postModModelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/modelcosts", modelCostRoutes);
app.use("/api/floodmodels", floodModelRoutes);
app.use("/api/checklist", prefloodchecklistRoutes);
app.use("/api/checklistt", postfloodchecklistRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
