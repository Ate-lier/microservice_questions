const mysql = require('mysql2/promise');

async function test() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'shen',
    password: 'wyw537537',
    database: 'testing'
  });

  const result = await connection.query('delete from majors where id > 8');
  console.log(result);
  await connection.end();
}


test().catch(console.log);
