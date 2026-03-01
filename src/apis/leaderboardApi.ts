import express from "express";
import {
  submitDailyScore,
  getLeaderboard,
  getUserDailyScore,
  getPercentile,
  submitCompletion,
} from "../controller/leaderboardController";

const router = express.Router();

router.post("/submit", submitDailyScore);
router.post("/complete", submitCompletion);
router.get("/percentile/:score/:playType/:timestamp", getPercentile);
router.get("/:playType/:timestamp", getLeaderboard);
router.get("/user/:userId/:playType/:timestamp", getUserDailyScore);

export default router;
