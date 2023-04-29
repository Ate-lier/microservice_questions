import { Request, Response, NextFunction } from 'express';
/*
import {
  readAnswers, createAnswer, delete
} from '../model/';
*/

export async function getAnswers(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}

export async function postAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}

export async function deleteAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}

export async function likeAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}

export async function unlikeAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}

export async function reportAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}