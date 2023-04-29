import request from 'supertest';
import app from '../app';
// import { connect, disconnect, getDatabase } from '../model/client';

// testing db connections


// testing questions



// testing answers
describe('GET /answers', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/answers');

    expect(result.status).toBe(200);
  });
});

describe('POST /answers', () => {
  it('should return status code 200', async () => {
    const result = await request(app).post('/answers').send({
      product_id: 111, test: 'hello world'
    });

    expect(result.status).toBe(200);
  });
});

describe('DELETE /answers/:answer_id', () => {
  it('should return status code 200', async () => {
    const result = await request(app).delete('/answers/1');

    expect(result.status).toBe(200);
  });
});

describe('POST /answers/:answer_id/like', () => {
  it('should return status code 200', async () => {
    const result = await request(app).post('/answers/1/like');

    expect(result.status).toBe(200);
  });
});

describe('PUT /answers/:answer_id/unlike', () => {
  it('should return status code 200', async () => {
    const result = await request(app).put('/answers/1/unlike').send({ test: 'hello world'});

    expect(result.status).toBe(200);
  });
});

describe('POST /answers/:answer_id/report', () => {
  it('should return status code 200', async () => {
    const result = await request(app).post('/answers/1/report').send({ test: 'hello world'});

    expect(result.status).toBe(200);
  });
});



// questions
describe('GET /questions', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions');

    expect(result.status).toBe(200);
  });
});

describe('POST /questions', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions');

    expect(result.status).toBe(200);
  });
});

describe('DELETE /questions/:question_id', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1');

    expect(result.status).toBe(200);
  });
});

describe('POST /questions/:question_id/like', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1/like');

    expect(result.status).toBe(200);
  });
});

describe('PUT /questions/:question_id/unlike', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1/unlike');

    expect(result.status).toBe(200);
  });
});

describe('POST /questions/:question_id/report', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1/report');

    expect(result.status).toBe(200);
  });
});