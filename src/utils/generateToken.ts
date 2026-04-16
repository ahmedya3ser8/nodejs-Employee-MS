import { Response } from "express";
import jwt from 'jsonwebtoken';

import { cookieConfig } from "../config/cookie";

const generateToken = (payload: { userId: string; email: string; role: string; }, res: Response) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
  res.cookie('ems_access_token', token, cookieConfig);
  return token;
}

export default generateToken;
