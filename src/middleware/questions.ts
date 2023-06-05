import { Request, Response, NextFunction} from 'express';

import { HttpError } from './error';
import * as model from '../model/questions';

// Uniform error checker for all catch block
function errorChecker(err: unknown) {
  if (err instanceof Error) {
    return [{
      type: 'Server',
      message: err.message
    }];
  } else {
    return [{
      type: 'Unknown',
      message: 'Unknown error occurred in the server'
    }];
  }
}


export async function getQuestions(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { product_id, sortBy = 'helpful', currentPage = 1, pageLimit = 5 } = req.query;
    const params = {
      product_id: Number(product_id),
      sortBy: sortBy as string,
      currentPage: Number(currentPage),
      pageLimit: Number(pageLimit)
    }
    const questions = await model.readQuestions(params);
    const questionsCount = await model.countQuestions(Number(product_id));
    res.status(200).json({ questions, questionsCount });
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

// Once created, send 201 and the created question(cound be null)
export async function postQuestion(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { product_id, body, asker_name, asker_email } = req.body;
    const result = await model.createQuestion({ product_id, body, asker_email, asker_name });

    if (!result.insertId || result.affectedRows === 0) {
      throw new Error('Insertion failed');
    }

    const insertedQuestion = await model.readQuestion(result.insertId);
    res.status(201).json({ question: insertedQuestion });
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

// Once deleted, send 204
export async function deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { question_id } = req.params;
    const result = await model.deleteQuestion(parseInt(question_id));

    if (result.affectedRows === 0) {
      throw new Error('Deletion failed');
    }

    res.sendStatus(204);
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

// Once update helpful, send 200 and the updated question
export async function likeQuestion(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { question_id } = req.params;
    const result = await model.updateQuestionHelpful(parseInt(question_id), true);

    if (result.affectedRows === 0) {
      throw new Error(`Updating the question's helpful failed`);
    }

    const updatedQuestion = await model.readQuestion(parseInt(question_id));
    res.status(200).json({ question: updatedQuestion });
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

// Once update helpful, send 200 and the updated question
export async function unlikeQuestion(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { question_id } = req.params;
    const result = await model.updateQuestionHelpful(parseInt(question_id), false);

    if (result.affectedRows === 0) {
      throw new Error(`Updating the question's helpful failed`);
    }

    const updatedQuestion = await model.readQuestion(parseInt(question_id));
    res.status(200).json({ question: updatedQuestion });
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

// Once update helpful, send 200 and the updated question
export async function reportQuestion(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { question_id } = req.params;
    const result = await model.updateQuestionReported(parseInt(question_id));

    if (result.affectedRows === 0) {
      throw new Error(`Reporting the question failed`);
    }

    const updatedQuestion = await model.readQuestion(parseInt(question_id));
    res.status(200).json({ question: updatedQuestion });
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}