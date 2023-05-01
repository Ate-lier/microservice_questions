import { getPool } from './db';

const pool = getPool();
// CREATE TABLE questions (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   product_id INT NOT NULL,
//   body TEXT NOT NULL,
//   date_written BIGINT NOT NULL,
//   answerer_name VARCHAR(255) NOT NULL,
//   answerer_email VARCHAR(255) NOT NULL,
//   reported INT NOT NULL,
//   helpful INT NOT NULL
// );

interface CreateQuestionParams {
  product_id: number,
  body: string,
  answerer_name: string,
  answerer_email: string
}

export async function createQuestion(params: CreateQuestionParams): Promise<any> {
  const queryString = "INSERT INTO questions SET ?";
  const [result] = await pool.query(queryString, params);
  console.log(result);
}


interface readQuestionsParams {
  product_id: number,
  sortBy?: string,
  currentPage?: number,
  pageLimit?: number
}

export async function readQuestions(params: readQuestionsParams): Promise<any> {
  const { product_id, sortBy = 'helpful', currentPage = 1, pageLimit = 5 } = params;
  const pageOffset = (currentPage - 1) * pageLimit;

  const [questions] = await pool.query(
    `SELECT * FROM questions WHERE product_id = ? ORDER BY ? LIMIT ? OFFSET ?`,
    [product_id, sortBy, pageLimit, pageOffset]
  );

  const [questionsCount] = await pool.query(
    `SELECT COUNT(*) FROM questions WHERE product_id = ?`,
    [product_id]
  );

  return { questions, questionsCount}
}


export async function deleteQuestion(id: number): Promise<any> {
  await pool.query('DELETE FROM questions WHERE id = ?', id);
}

