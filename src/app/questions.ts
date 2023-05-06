import express, { Router } from 'express';
import {
  getQuestions, getQuestionsValidation,
  postQuestion, postQuestionValidation,
  deleteQuestion, deleteQuestionValidation,
  likeQuestion, likeQuestionValidation,
  unlikeQuestion, unlikeQuestionValidation,
  reportQuestion, reportQuestionValidation
} from '../middleware';

const router = Router();

router.get('/', getQuestionsValidation, getQuestions);
router.post('/', postQuestionValidation, postQuestion);
router.delete('/:question_id', deleteQuestionValidation, deleteQuestion);
router.patch('/:question_id/like', likeQuestionValidation, likeQuestion);
router.patch('/:question_id/unlike', unlikeQuestionValidation, unlikeQuestion);
router.patch('/:question_id/report', reportQuestionValidation, reportQuestion);

// idempotent update

export default router;