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

router.get('/questions', getQuestionsValidation, getQuestions);
router.post('/questions', postQuestionValidation, postQuestion);
router.delete('/questions/:question_id', deleteQuestionValidation, deleteQuestion);
router.patch('/questions/:question_id/like', likeQuestionValidation, likeQuestion);
router.patch('/questions/:question_id/unlike', unlikeQuestionValidation, unlikeQuestion);
router.patch('/questions/:question_id/report', reportQuestionValidation, reportQuestion);

// idempotent update

export default router;