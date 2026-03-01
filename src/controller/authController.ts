import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { findOrCreateUser } from "../service/authService";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ status: 400, message: "Missing Google credential" });
      return;
    }
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ status: 401, message: "Invalid Google token" });
      return;
    }
    const user = await findOrCreateUser({
      googleId: payload.sub,
      email: payload.email || "",
      name: payload.name || "",
      picture: payload.picture || "",
    });
    res.status(200).json({
      status: 200,
      user: {
        id: user.getDataValue("id"),
        googleId: user.getDataValue("googleId"),
        email: user.getDataValue("email"),
        name: user.getDataValue("name"),
        picture: user.getDataValue("picture"),
        username: user.getDataValue("username"),
      },
    });
  } catch (err) {
    console.error(`authController~googleLogin() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to authenticate with Google" });
  }
};

export const setUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, username } = req.body;
    if (!userId || !username) {
      res.status(400).json({ status: 400, message: "Missing userId or username" });
      return;
    }
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      res.status(400).json({ status: 400, message: "Username must be 3-20 characters" });
      return;
    }
    const existing = await User.findOne({ where: { username: trimmed } });
    if (existing) {
      res.status(409).json({ status: 409, message: "Username already taken" });
      return;
    }
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ status: 404, message: "User not found" });
      return;
    }
    await user.update({ username: trimmed });
    res.status(200).json({ status: 200, username: trimmed });
  } catch (err) {
    console.error(`authController~setUsername() => ${err}`);
    res.status(500).json({ status: 500, message: "Failed to set username" });
  }
};
