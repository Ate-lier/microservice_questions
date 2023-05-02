const schema = `
DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  asker_name VARCHAR(255) NOT NULL,
  asker_email VARCHAR(255) NOT NULL,
  reported INT NOT NULL DEFAULT 0,
  helpful INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS answers;
CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date_written TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  answerer_name VARCHAR(255) NOT NULL,
  answerer_email VARCHAR(255) NOT NULL,
  reported INT NOT NULL DEFAULT 0,
  helpful INT NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS answers_photos;
CREATE TABLE answers_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL,
  url TEXT NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS reports_category;
CREATE TABLE reports_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS questions_reports;
CREATE TABLE questions_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  category_id INT NOT NULL,
  body TEXT,
  reporter_email VARCHAR(255) NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES reports_category(id)
);

DROP TABLE IF EXISTS answers_reports;
CREATE TABLE answers_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL,
  category_id INT NOT NULL,
  body TEXT,
  reporter_email VARCHAR(255) NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES reports_category(id)
);
`;

export default schema;
