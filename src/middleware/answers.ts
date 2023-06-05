import { Request, Response, NextFunction } from 'express';

import { HttpError } from './error';
import { getPool } from '../model/db';
import * as answerModel from '../model/answers';
import * as photoModel from '../model/photos';

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


export async function getAnswers(req: Request, res: Response, next: NextFunction): Promise<any> {
  res.sendStatus(501);
}

export async function postAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  const connection = await getPool().getConnection();

  try {
    const { question_id, body, answerer_name, answerer_email, photos } = req.body;

    // Start Transaction
    await connection.beginTransaction();

    const answerResult = await answerModel.createAnswer({ question_id, body, answerer_email, answerer_name });

    if (!answerResult.insertId || answerResult.affectedRows === 0) {
      throw new Error('Insertion of Answer failed');
    }

    const insertedAnswer = await answerModel.readAnswer(answerResult.insertId);

    if (photos) {
      const photoResult = await photoModel.createPhotos(answerResult.insertId, photos);

      if (photoResult.affectedRows !== photos.length) {
        throw new Error('Insertion of Photos failed');
      }

      insertedAnswer[0].photos = photos;
    }

    await connection.commit();
    res.status(201).json({ answer: insertedAnswer });
  } catch (err) {
    // If any error happened, roll back the transaction
    await connection.rollback();

    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  } finally {
    connection.release();
  }
}

export async function deleteAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { answer_id } = req.params;
    const result = await answerModel.deleteAnswer(parseInt(answer_id));

    if (result.affectedRows === 0) {
      throw new Error('Deletion failed');
    }

    res.sendStatus(204);
  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

export async function likeAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { answer_id } = req.params;
    const result = await answerModel.updateAnswerHelpful(parseInt(answer_id), true);

    if (result.affectedRows === 0) {
      throw new Error('Like Failed');
    }

    // Might Refactor to "204 No Content"
    const updatedAnswer = await answerModel.readAnswer(parseInt(answer_id));
    res.status(200).json({ answer: updatedAnswer });

  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

export async function unlikeAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { answer_id } = req.params;
    const result = await answerModel.updateAnswerHelpful(parseInt(answer_id), false);

    if (result.affectedRows === 0) {
      throw new Error('Unlike Failed');
    }

    // Might Refactor to "204 No Content"
    const updatedAnswer = await answerModel.readAnswer(parseInt(answer_id));
    res.status(200).json({ answer: updatedAnswer });

  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}

export async function reportAnswer(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { answer_id } = req.params;
    const result = await answerModel.updateAnswerReported(parseInt(answer_id));

    if (result.affectedRows === 0) {
      throw new Error('Report Failed');
    }

    // Might Refactor to "204 No Content"
    const updatedAnswer = await answerModel.readAnswer(parseInt(answer_id));
    res.status(200).json({ answer: updatedAnswer });

  } catch (err) {
    const errors = errorChecker(err);
    next(new HttpError(errors, 500));
  }
}