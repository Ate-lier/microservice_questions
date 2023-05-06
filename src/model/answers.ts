import { getPool } from './db';

// const pool = getPool();
// CREATE TABLE answers (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   question_id INT NOT NULL,
//   body TEXT NOT NULL,
//   date_written BIGINT NOT NULL DEFAULT UNIX_TIMESTAMP() * 1000,
//   answerer_name VARCHAR(255) NOT NULL,
//   answerer_email VARCHAR(255) NOT NULL,
//   reported INT NOT NULL DEFAULT 0,
//   helpful INT NOT NULL DEFAULT 0,
//   FOREIGN KEY (question_id) REFERENCES answers(id) ON DELETE CASCADE
// );


interface CreateAnswerParams {
  question_id: number,
  body: string,
  date_written: number,
  answerer_name: string,
  answerer_email: string
}

export async function createAnswer(params: CreateAnswerParams): Promise<any> {
  const queryString = "INSERT INTO answers SET ?";
  const result = await getPool().query(queryString, params);
  console.log(result);
}


interface readAnswersParams {
  product_id: number,
  sortBy?: string,
  currentPage?: number,
  pageLimit?: number
}

export async function readAnswers(params: readAnswersParams): Promise<any> {
  const { product_id, sortBy = 'helpful', currentPage = 1, pageLimit = 5 } = params;
  const pageOffset = (currentPage - 1) * pageLimit;

  const [answers] = await getPool().query(
    `SELECT * FROM answers WHERE product_id = ? ORDER BY ? LIMIT ? OFFSET ?`,
    [product_id, sortBy, pageLimit, pageOffset]
  );

  const [answersCount] = await getPool().query(
    `SELECT COUNT(*) FROM answers WHERE product_id = ?`,
    [product_id]
  );

  console.log(answers, answersCount);
  return { answers, answersCount };
}


export async function deleteAnswer(id: number): Promise<any> {
  await getPool().query('DELETE FROM answers WHERE id = ?', id);
}
