import mysql, { Pool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

// this be unqiue to each dot env configuration
const configuration = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // multipleStatements: true
};

let pool: Pool | null = null;

export async function connect(): Promise<any> {
  if (pool) return false;

  try {
    pool = mysql.createPool(configuration);
  } catch (err) {
    throw new Error('MySQL Connection Error');
  }
}

export async function disconnect(): Promise<any> {
  if (!pool) return false;

  try {
    await pool.end();
    pool = null;
  } catch (err) {
    throw new Error('MySQL Disconnection Error');
  }
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database is not connected');
  }

  return pool;
}


