import request, { Response } from 'supertest';
import app from '../app';
import { connect, disconnect, getPool } from '../model/db';

describe('Database Connection', () => {
  it('should raise error when try to getPool without being connected', async () => {
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


describe('API Testing: Route Questions', () => {

  beforeAll(async () => await connect());
  afterAll(async () => await disconnect());

  describe('POST /questions', () => {
    describe('When succeeded:', () => {
      let response: Response;

      const validPostData = {
        product_id: 1,
        body: 'this is a test message',
        asker_name: 'Shennie',
        asker_email: 'shenniewu@gmail.com'
      };

      beforeAll(async () => {
        response = await request(app)
          .post('/questions')
          .send(validPostData);
      });

      it('should respond with status code of 201', async () => {
        expect(response.status).toBe(201);
      });

      it('should respond with a body in format of { question: [question] }', async () => {
        expect(response.body).toHaveProperty('question');
        expect(response.body)
      });

      it('should has default 0 for both helpful and reported properties', async () => {

      });
    })
    describe('When Failed', () => {

    });

  });

  // describe('POST /questions', () => {
  //   describe('When succeeded:', () => {
  //     let response: Response | null = null;


  //     it('should respond with status code of 201', async () => {
  //       expect(response.status).toBe(201);
  //     });

  //     it('should respond with a JSON in format of { question: [question] }', async () => {
  //       expect(response.body).toHaveProperty('question');
  //       expect(response.body.question).toMatchObject({
  //         product_id: 1,
  //         body: 'This is a test message',
  //         asker_name: 'Shennie',
  //         asker_email: 'shenniewu@gmail.com',
  //       });
  //     });

  //     it('should have default 0 for both helpful and reported properties', async () => {
  //       expect(response.body.question).toHaveProperty('helpful', 0);
  //       expect(response.body.question).toHaveProperty('reported', 0);
  //     });
  //   });
  // });

  describe.skip('PATCH /questions/:question_id/like', () => {

  });

  describe.skip('PATCH /questions/:question_id/unlike', () => {

  });

  describe.skip('PATCH /questions/:question_id/report', () => {

  });

  describe('GET /questions', () => {
    // fakeData

    it ('should by default get the 5 most helpful questions', async () => {
      const response = await request(app).get('/questions')
      .query({
        product_id: 1,
        sortBy: 'helpful',
        currentPage: 1,
        pageLimit: 5,
      });
      expect(response.status).toBe(200);
      expect(response.body.questions).toBeDefined();
      expect(response.body.questionsCount).toBeDefined();

    })
  });

  describe.skip('DELETE /questions/:question_id', () => {

  });

});



// describe.skip('POST /questions/:question_id/like', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).get('/questions/1/like');

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('PUT /questions/:question_id/unlike', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).get('/questions/1/unlike');

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('POST /questions/:question_id/report', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).get('/questions/1/report');

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('DELETE /questions/:question_id', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).get('/questions/1');

//     expect(result.status).toBe(200);
//   });
// });



// // testing answers
// describe.skip('GET /answers', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).get('/answers');

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('POST /answers', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).post('/answers').send({
//       product_id: 111, test: 'hello world'
//     });

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('DELETE /answers/:answer_id', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).delete('/answers/1');

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('POST /answers/:answer_id/like', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).post('/answers/1/like');

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('PUT /answers/:answer_id/unlike', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).put('/answers/1/unlike').send({ test: 'hello world'});

//     expect(result.status).toBe(200);
//   });
// });

// describe.skip('POST /answers/:answer_id/report', () => {
//   it('should return status code 200', async () => {
//     const result = await request(app).post('/answers/1/report').send({ test: 'hello world'});

//     expect(result.status).toBe(200);
//   });
// });



