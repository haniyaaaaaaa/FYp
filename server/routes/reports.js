// reports/reportRoutes.js
const router = require("express").Router();
const ReportModel = require("../models/ReportModel");


router.get("/", async (req, res) => {
    try {
      const reportmodel = await ReportModel.find();
      res.json(reportmodel);
      
    } catch (error) {
      console.error("Error fetching historical flood reports:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  module.exports = router;