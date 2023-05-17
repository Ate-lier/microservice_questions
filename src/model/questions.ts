import { write, writev } from 'fs';
import { getPool } from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// const pool = getPool();

// // it is an error when no rows are affected after write operations
// function writeValidator(result: ResultSetHeader): void {
//   if (result.affectedRows === 0) {
//     throw new Error('No rows were affected');
//   }
// }


interface readQuestionsParams {
  product_id: number,
  sortBy: string,
  currentPage: number,
  pageLimit: number
}

// Read 1 or more questions based on input parameters
export async function readQuestions(params: readQuestionsParams): Promise<any> {
  const { product_id, sortBy, currentPage, pageLimit} = params;
  const pageOffset = (currentPage - 1) * pageLimit;

  // let sortClause = sortBy + 'DESC';

  const [questions] = await getPool().query<RowDataPacket[]>(
    `SELECT * FROM questions WHERE
    product_id = ?
    ORDER BY ?? DESC
    LIMIT ?
    OFFSET ?`,
    [product_id, sortBy, pageLimit, pageOffset]
  );

  return questions;
}

// Count number of questions for 1 product
export async function countQuestions(product_id: number): Promise<any> {
  const [questionsCount] = await getPool().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM questions WHERE product_id = ?`,
    [product_id]
  );

  return questionsCount[0].total;
}

interface CreateQuestionParams {
  product_id: number,
  body: string,
  asker_name: string,
  asker_email: string
}

// No try catch, let middleware handle all database-related errors
export async function createQuestion(params: CreateQuestionParams): Promise<any> {
  const queryString = "INSERT INTO questions SET ?";
  const [result] = await getPool().query<ResultSetHeader>(queryString, params);

  // writeValidator(result);
  return result;
}

// Read 1 question by question_id
export async function readQuestion(id: number): Promise<any> {
  const queryString = 'SELECT * FROM questions WHERE id = ?';
  const [result] = await getPool().query<RowDataPacket[]>(queryString, [id]);

  return result;
}

// Delete 1 row
export async function deleteQuestion(id: number): Promise<any> {
  const queryString = 'DELETE FROM questions WHERE id = ?';
  const [result] = await getPool().query<ResultSetHeader>(queryString, id);

  // writeValidator(result);
  return result;
}

// Add 1 to or minus 1 from helpful column for a single row
export async function updateQuestionHelpful(id: number, isUpvote: boolean): Promise<any> {
  const queryString = 'UPDATE questions SET helpful = helpful + ? WHERE id = ?';
  const [result] = await getPool().query<ResultSetHeader>(queryString, [isUpvote ? 1 : -1, id]);

  // writeValidator(result);
  return result;
}

// Add 1 to reported column for a single row
export async function updateQuestionReported(id: number): Promise<any> {
  const queryString = 'UPDATE questions SET reported = reported + 1 WHERE id = ?';
  const [result] = await getPool().query<ResultSetHeader>(queryString, id);

  // writeValidator(result);
  return result;
}


// Now let's handle the error in the middleware side, model should not contain any complex business logic

