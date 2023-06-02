const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'yuheng',
    password: '12345',
    database: 'test'
  });

  try {
    const queryString = 'INSERT INTO test1 (name, age) VALUES ?';
    const values = [['shen', 25], ['yuheng', 24], ['ted', 24]];
    const result = await connection.query(queryString, [values]);

    console.log(result);
  } catch (err) {
    console.log(err.sqlMessage);
    await connection.end();
  }

  await connection.end();
}


test().catch(console.log);
