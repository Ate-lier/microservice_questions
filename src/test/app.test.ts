import request from 'supertest';
import app from '../app';
import { connect, disconnect, getPool } from '../model/db';


describe('Database Connection', () => {
  it('should raise error when try to getPool without being connected',async () => {
    expect(() => getPool()).toThrow();
  });

  it('should create a pool when successfully connected', async () => {
    await connect();
    const pool = getPool();
    expect(pool).toHaveProperty('query');
  });

  it('should do nothing if trying to connect when connected', async () => {
    expect(await connect()).toStrictEqual(false);
  });

  it('should delete the pool when disconnected', async () => {
    await disconnect();
    expect(() => getPool()).toThrow();
  });

  it('should do nothing if trying to disconnect when disconnected', async () => {
    expect(await disconnect()).toStrictEqual(false);
  })
});


// questions
describe.skip('POST /questions', () => {
  const validPostData = {
    product_id: 1,
    body: 'test',
    
  };

  const invalidPostData = {

  };
});

describe.skip('GET /questions', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions');

    expect(result.status).toBe(200);
  });
});

describe.skip('POST /questions/:question_id/like', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1/like');

    expect(result.status).toBe(200);
  });
});

describe.skip('PUT /questions/:question_id/unlike', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1/unlike');

    expect(result.status).toBe(200);
  });
});

describe.skip('POST /questions/:question_id/report', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1/report');

    expect(result.status).toBe(200);
  });
});

describe.skip('DELETE /questions/:question_id', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/questions/1');

    expect(result.status).toBe(200);
  });
});



// testing answers
describe.skip('GET /answers', () => {
  it('should return status code 200', async () => {
    const result = await request(app).get('/answers');

    expect(result.status).toBe(200);
  });
});

describe.skip('POST /answers', () => {
  it('should return status code 200', async () => {
    const result = await request(app).post('/answers').send({
      product_id: 111, test: 'hello world'
    });

    expect(result.status).toBe(200);
  });
});

describe.skip('DELETE /answers/:answer_id', () => {
  it('should return status code 200', async () => {
    const result = await request(app).delete('/answers/1');

    expect(result.status).toBe(200);
  });
});

describe.skip('POST /answers/:answer_id/like', () => {
  it('should return status code 200', async () => {
    const result = await request(app).post('/answers/1/like');

    expect(result.status).toBe(200);
  });
});

describe.skip('PUT /answers/:answer_id/unlike', () => {
  it('should return status code 200', async () => {
    const result = await request(app).put('/answers/1/unlike').send({ test: 'hello world'});

    expect(result.status).toBe(200);
  });
});

describe.skip('POST /answers/:answer_id/report', () => {
  it('should return status code 200', async () => {
    const result = await request(app).post('/answers/1/report').send({ test: 'hello world'});

    expect(result.status).toBe(200);
  });
});



