import express, { Router } from 'express';
import {
  getQuestions, postQuestion, deleteQuestion,
  likeQuestion, unlikeQuestion, reportQuestion
} from '../middleware';

const router = Router();

router.get('/questions', getQuestions);
router.post('/questions', postQuestion);
router.delete('/questions/:question_id', deleteQuestion);
router.post('/questions/:question_id/like', likeQuestion);
router.put('/questions/:question_id/unlike', unlikeQuestion);
router.post('/questions/:question_id/report', reportQuestion);

export default router;