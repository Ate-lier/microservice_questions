import mysql from 'mysql2/promise';
import schema from './schema';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
// import ProgressBar from 'progress';


// get file path from table name
function getFilePath(tableName: string): string {
  return path.resolve(__dirname, '../../CSV/files/' + tableName + '.csv');
}

// main ETL function
async function etl(): Promise<string> {
  const start = new Date().valueOf();

  // make a connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
  });

  console.log('Database connected...');

  // change MySQL configuration
  await connection.query(`
    SET FOREIGN_KEY_CHECKS=0; 
    SET GLOBAL LOCAL_INFILE=1;
  `);

  // create schemas
  await connection.query(schema);
  console.log('All schemas are created...');

  // base query string and then add input processing
  const baseQueryString = `
    LOAD DATA LOCAL INFILE ?
    INTO TABLE ??
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES
  `;
  
  const questionsQueryString = baseQueryString + `
    (id, product_id, body, @date_written, asker_name, asker_email, reported, helpful)
    SET date_written = FROM_UNIXTIME(@date_written/1000)
  `;

  const answersQueryString = baseQueryString + `
    (id, question_id, body, @date_written, answerer_name, answerer_email, reported, helpful)
    SET date_written = FROM_UNIXTIME(@date_written/1000)
  `;

  // stream factory function for data transmission
  const infileStreamFactory = (fileName: string) => fs.createReadStream(fileName);

  // load questions
  console.log('Loading table questions...');
  await connection.query({
    sql: questionsQueryString, 
    values: [getFilePath('questions'), 'questions'],
    infileStreamFactory
  });
  console.log('Table questions finishes loading...');

  // load answers
  console.log('Loading table answers...');
  await connection.query({
    sql: answersQueryString, 
    values: [getFilePath('answers'), 'answers'],
    infileStreamFactory
  });
  console.log('Table answers finishes loading...');

  // load answers_photos
  console.log('Loading table answers_photos...');
  await connection.query({
    sql: baseQueryString, 
    values: [getFilePath('answers_photos'), 'answers_photos'],
    infileStreamFactory
  });
  console.log('Table answers_photos finishes loading...');

  // change back the configuration
  await connection.query(`
    SET FOREIGN_KEY_CHECKS=1; 
    SET GLOBAL LOCAL_INFILE=0;
  `);

  // disconnect after ETL finishes
  const end = new Date().valueOf();
  await connection.end();
  console.log('Database disconnected...');

  return ((end - start)/1000/60).toFixed(2);
}

etl().then(minutes => console.log(`ETL took ${minutes} minutes`)).catch(console.log);


//console.log(`Reading CSV file from: ${filePath}`);
//
//const fileSize = fs.statSync(filePath).size;
//const bar = new ProgressBar('Loading data [:bar] :percent :etas', {
//  complete: '=',
//  incomplete: ' ',
//  width: 20,
//  total: fileSize,
//});
//
//let connection: Connection | undefined;
//
//createConnection(config)
//  .then((conn) => {
//    connection = conn;
//    console.log('Connected to database!');
//
//    const fileStream = fs.createReadStream(filePath);
//    fileStream.on('data', (chunk) => bar.tick(chunk.length));
//
//    return conn.query({
//      sql: queryString,
//      values: [filePath],
//      infileStreamFactory: () => fileStream,
//    });
//  })
//  .then(() => {
//    console.log('Data loading completed successfully!');
//  })
//  .catch((error) => {
//    console.log('An error occurred during the data loading process:', error);
//  })
//  .finally(() => {
//    console.log('Closing database connection...');
//    if (connection) {
//      connection.end();
//    }
//  });
//
//
//
