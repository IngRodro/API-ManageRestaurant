// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';

declare global {
  namespace Express {
    export interface Request {
      username: string;
    }
  }
}
