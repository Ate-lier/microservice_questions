import { write, writev } from 'fs';
import { getPool } from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const pool = getPool();

// it is an error when no rows are affected after write operations
function writeValidator(result: ResultSetHeader): void {
  if (result.affectedRows === 0) {
    throw new Error('No rows were affected');
  }
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
  const [result] = await pool.query<ResultSetHeader>(queryString, params);
  
  writeValidator(result);
  return result;
}

interface readQuestionsParams {
  product_id: number,
  sortBy?: string,
  currentPage?: number,
  pageLimit?: number
}

// Read 1 or more questions based on input parameters
export async function readQuestions(params: readQuestionsParams): Promise<any> {
  const { product_id, sortBy = 'helpful', currentPage = 1, pageLimit = 5 } = params;
  const pageOffset = (currentPage - 1) * pageLimit;

  const [questions] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM questions WHERE product_id = ? ORDER BY ? LIMIT ? OFFSET ?`,
    [product_id, sortBy, pageLimit, pageOffset]
  );

  const [questionsCount] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM questions WHERE product_id = ?`,
    [product_id]
  );

  return { questions, questionsCount: questionsCount[0].total };
}

// Delete 1 row
export async function deleteQuestion(id: number): Promise<any> {
  const queryString = 'DELETE FROM questions WHERE id = ?';
  const [result] = await pool.query<ResultSetHeader>(queryString, id);

  writeValidator(result);
  return result;
}

// Add 1 to or minus 1 from helpful column for a single row
export async function updateQuestionHelpful(id: number, isUpvote: boolean): Promise<any> {
  const queryString = 'UPDATE questions SET helpful = helpful + ? WHERE id = ?';
  const [result] = await pool.query<ResultSetHeader>(queryString, [isUpvote, id]);

  writeValidator(result);
  return result;
}

// Add 1 to reported column for a single row
export async function updateQuestionReported(id: number): Promise<any> {
  const queryString = 'UPDATE questions SET reported = reported + 1 WHERE id = ?';
  const [result] = await pool.query<ResultSetHeader>(queryString, id);

  writeValidator(result);
  return result;
}

