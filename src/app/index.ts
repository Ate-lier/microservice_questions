import express, { Request, Response } from 'express';
import answerRouter from './answers';
import questionRouter from './questions';
import { errorHandler } from '../middleware/error';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test, just a placeholder, only for developmet phase
app.get('/test', (req: Request, res: Response) => {
  res.status(200).json({ test: 'hello world'});
});

// Router: Answer & Question
app.use('/answers', answerRouter);
app.use('/questions', questionRouter);

// Error Handler
app.use(errorHandler);

export default app;