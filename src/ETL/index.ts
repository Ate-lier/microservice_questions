// dont forget to add a table named reports

import { createConnection, Connection } from 'mysql2/promise';
import schema from './schema';
import path from 'path';
import fs from 'fs';
import ProgressBar from 'progress';

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'atelier',
  multipleStatements: true,
};

const filePath = path.resolve(__dirname, '../../CSV/files/answers_photos.csv');
const queryString = `
  SET GLOBAL local_infile = 1;
  LOAD DATA LOCAL
  INFILE ?
  INTO TABLE answers_photos
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES;
`;

console.log(`Reading CSV file from: ${filePath}`);

const fileSize = fs.statSync(filePath).size;
const bar = new ProgressBar('Loading data [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: fileSize,
});

let connection: Connection | undefined;

createConnection(config)
  .then((conn) => {
    connection = conn;
    console.log('Connected to database!');

    const fileStream = fs.createReadStream(filePath);
    fileStream.on('data', (chunk) => bar.tick(chunk.length));

    return conn.query({
      sql: queryString,
      values: [filePath],
      infileStreamFactory: () => fileStream,
    });
  })
  .then(() => {
    console.log('Data loading completed successfully!');
  })
  .catch((error) => {
    console.log('An error occurred during the data loading process:', error);
  })
  .finally(() => {
    console.log('Closing database connection...');
    if (connection) {
      connection.end();
    }
  });



// createConnection(config)
//   .then(conn => conn.query({
//     sql: queryString,
//     values: [filePath],
//     infileStreamFactory: () => fs.createReadStream(filePath)
//   }))
//   .then(() => 'ok')
//   .catch(console.log)


  /*
  .then(conn => conn.query(schema))
  .then(() => console.log('succeed'))
  .catch(console.log);
  */