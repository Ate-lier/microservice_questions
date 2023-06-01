import { getPool } from './db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createPhotos(answer_id: number, urls: string[]): Promise<any> {
  const queryString = "INSERT INTO answers_photos (answer_id, url) VALUES ?";
  const [result] = await getPool().query<ResultSetHeader>(queryString, urls.map(url => [answer_id, url]));

  return result;
}

