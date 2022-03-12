import express from 'express';

export interface AuthRequest extends express.Request {
  username?: string;
}
