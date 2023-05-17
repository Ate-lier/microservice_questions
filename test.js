const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'yuheng',
    password: '12345',
    database: 'atelier'
  });

  try {
    const result = await connection.query('select * from questions where id < 5');
    console.log(result);
  } catch (err) {
    console.log(err.sqlMessage);
    await connection.end();
  }

  await connection.end();
}


test().catch(console.log);
