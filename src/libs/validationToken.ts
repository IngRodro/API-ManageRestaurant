import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IPayload {
  username: string;
}

export const TokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('auth-token');
    if (!token)
      return res.status(401).json({
        message: 'Access Denied',
        code: 401,
      });
    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET || ''
    ) as IPayload;
    req.username = payload.username;
    return next();
  } catch (e) {
    return res.status(400).send({
      message: 'Invalid Token',
      code: 400,
    });
  }
};
