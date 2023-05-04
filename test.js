const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'shen',
    password: 'wyw537537',
    database: 'testing'
  });

  try {
    const result = await connection.query('select * from majors where id = 20');
    console.log(result);
  } catch (err) {
    console.log(err.sqlMessage);
    await connection.end();
  }

  await connection.end();
}


test().catch(console.log);
