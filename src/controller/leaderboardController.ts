import { Request, Response } from "express";
import {
  submitScore,
  submitGameCompletion,
  getDailyLeaderboard,
  getUserScore,
  getScorePercentile,
} from "../service/leaderboardService";

export const submitDailyScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, score, playType, timestamp } = req.body;

    if (!userId || score === undefined || playType === undefined || !timestamp) {
      res.status(400).json({ status: 400, message: "Missing required fields" });
      return;
    }

    const dailyScore = await submitScore(userId, score, playType, timestamp);

    res.status(200).json({ status: 200, data: dailyScore });
  } catch (err) {
    console.error(`leaderboardController~submitDailyScore() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to submit score" });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playType, timestamp } = req.params;

    if (!playType || !timestamp) {
      res.status(400).json({ status: 400, message: "Missing playType or timestamp" });
      return;
    }

    const leaderboard = await getDailyLeaderboard(
      Number(playType),
      Number(timestamp)
    );

    res.status(200).json({ status: 200, data: leaderboard });
  } catch (err) {
    console.error(`leaderboardController~getLeaderboard() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get leaderboard" });
  }
};

export const getUserDailyScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, playType, timestamp } = req.params;

    const score = await getUserScore(
      Number(userId),
      Number(playType),
      Number(timestamp)
    );

    res.status(200).json({ status: 200, data: score });
  } catch (err) {
    console.error(`leaderboardController~getUserDailyScore() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get user score" });
  }
};

export const getPercentile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { score, playType, timestamp } = req.params;

    const result = await getScorePercentile(
      Number(score),
      Number(playType),
      Number(timestamp)
    );

    res.status(200).json({ status: 200, data: result });
  } catch (err) {
    console.error(`leaderboardController~getPercentile() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to get percentile" });
  }
};
export const submitCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { score, playType, timestamp } = req.body;
    if (score === undefined || playType === undefined || !timestamp) {
      res.status(400).json({ status: 400, message: "Missing required fields" });
      return;
    }
    const completion = await submitGameCompletion(score, playType, timestamp);
    res.status(200).json({ status: 200, data: completion });
  } catch (err) {
    console.error(`leaderboardController~submitCompletion() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to submit completion" });
  }
};
