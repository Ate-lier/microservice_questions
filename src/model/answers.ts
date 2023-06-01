import { getPool } from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';


// READ
interface readAnswersParams {
  question_id: number,
  sortBy: string,
  currentPage: number,
  pageLimit: number
}

export async function readAnswers(params: readAnswersParams): Promise<any> {
  const { currentPage, pageLimit, question_id, sortBy } = params;
  const pageOffset = (currentPage - 1) * pageLimit;

  const [answers] = await getPool().query(
    `SELECT * FROM answers WHERE question_id = ? ORDER BY ?? DESC LIMIT ? OFFSET ?`,
    [question_id, sortBy, pageLimit, pageOffset]
  )


  return answers;
}

// Count number of answers for a specific question
export async function countAnswers(question_id: number): Promise<any> {
  const [answersCount] = await getPool().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM answers WHERE question_id = ?`,
    question_id
  );

  return answersCount[0].total;
}

// CREATE
interface CreateAnswerParams {
  question_id: number,
  body: string,
  answerer_name: string,
  answerer_email: string
}

export async function createAnswer(params: CreateAnswerParams): Promise<any> {
  const queryString = "INSERT INTO answers SET ?";
  const [result] = await getPool().query(queryString, params);

  return result;
}

// DELETE
export async function deleteAnswer(id: number): Promise<any> {
  const queryString = 'DELETE FROM answers WHERE id = ?';
  const [result] = await getPool().query<ResultSetHeader>(queryString, id);

  return result;
}


// UPDATE Helpful by [+1, -1]
export async function updateAnswerHelpful(id: number, isUpvote: boolean): Promise<any> {
  const queryString = 'UPDATE answers SET helpful = helpful + ? WHERE id = ?';
  const [result] = await getPool().query<ResultSetHeader>(queryString, [isUpvote ? 1 : -1, id]);

  return result;
}

// UPDATE reported by +1
export async function updateAnswerReported(id: number): Promise<any> {
  const queryString = 'UPDATE answers SET reported = reported + 1 WHERE id = ?';
  const [result] = await getPool().query<ResultSetHeader>(queryString, id);

  return result;
}
