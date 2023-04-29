const schema = `
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR(255) NOT NULL,
  answerer_email VARCHAR(255) NOT NULL,
  reported INT NOT NULL,
  helpful INT NOT NULL
);

CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR(255) NOT NULL,
  answerer_email VARCHAR(255) NOT NULL,
  reported INT NOT NULL,
  helpful INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE answers_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL,
  url TEXT NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE
);
`;

export default schema;