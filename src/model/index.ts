import { readAnswers, createAnswer, deleteAnswer } from "./answers";

const createParams = {
  question_id: 1,
  body: 'HEHE',
  date_written: 1111111,
  answerer_name: 'SHENNIE',
  answerer_email: 'SHENNIEWU@GMAIL.COM'
}

async function test() {
  createAnswer(createParams);
}