import request, { Response } from 'supertest';
import app from '../app';
import { connect, disconnect, getPool } from '../model/db';
import { RowDataPacket } from 'mysql2';
import { setTimeout } from 'timers/promises';

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

// record all question_id that may generated in the integration tests
const generatedQuestionIds: Array<number> = [];

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

      // post once for all test suites
      beforeAll(async () => {
        response = await request(app)
          .post('/questions')
          .send(validPostData);

        const id = response.body.question[0].id;
        generatedQuestionIds.push(id);
      });

      it('should respond with status code of 201', async () => {
        expect(response.status).toBe(201);
      });

      it('should respond with a body in format of { question: [question] }', async () => {
        expect(response.body).toHaveProperty('question');
        expect(response.body.question).toMatchObject([validPostData]);
      });

      it('should has default 0 for both helpful and reported properties', async () => {
        expect(response.body.question[0]).toHaveProperty('helpful', 0);
        expect(response.body.question[0]).toHaveProperty('reported', 0);
      });
    })

    describe('When Failed', () => {
      it('should raise 400 error when missing required parameters', async () => {
        const response = await request(app)
          .post('/questions')
          .send({ product_id: 1 }); // missing 3 required params

        expect(response.status).toBe(400);
      });

      it('should raise 400 error when parameters in wrong data type', async () => {
        const response = await request(app)
          .post('/questions')
          .send({
            product_id: 0, // min 1
            body: 'this is testing message',
            asker_name: 'a', // too small string length
            asker_email: 12345, // not valid email
          });

        expect(response.status).toBe(400);
      });

      it('should respond with error format like { error: [errorObj] }', async () => {
        const response = await request(app)
        .post('/questions')
        .send({ product_id: 0 }); // a random bad request body

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBeInstanceOf(Array);
      });

      it("errorObj should be like { type = 'validation', message: string } when 400 error", async () => {
        const response = await request(app)
        .post('/questions')
        .send({ product_id: 0 }); // a random bad request body

        expect(response.body.error[0]).toHaveProperty('type', 'Validation');
        expect(response.body.error[0]).toHaveProperty('message');
      });
    });

  });

  describe('PATCH /questions/:question_id/like', () => {
    let question_id: number;

    // create a new question to test like functionality
    beforeAll(async () => {
      const postResponse = await request(app)
        .post('/questions')
        .send({
          product_id: 1,
          body: 'this is a test message',
          asker_name: 'Shennie',
          asker_email: 'shenniewu@gmail.com'
        });

      question_id = postResponse.body.question[0].id;
      generatedQuestionIds.push(question_id);
    });

    it('should respond with 2xx status code when succeed', async () => {
      const response = await request(app)
        .patch(`/questions/${question_id}/like`);

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    });

    it('should add the question helpful by 1', async () => {
      const [questions] = await getPool()
        .query<RowDataPacket[]>(`SELECT helpful FROM questions WHERE id = ?`, question_id);

      expect(questions[0].helpful).toBe(1)
    });
  });

  describe('PATCH /questions/:question_id/unlike', () => {
    // reuse the last question
    const question_id = generatedQuestionIds[generatedQuestionIds.length - 1];
    console.log('this is the question id ~!~!~!~!~!~!:', question_id, generatedQuestionIds);

    it('should respond with 2xx status code when succeed', async () => {
      // first of all, make sure this question_id has 1 helpful
      const [questions] = await getPool().query<RowDataPacket[]>(`SELECT helpful FROM questions WHERE id = 1`);

      expect(questions[0].helpful).toBe(1);

      const response = await request(app)
        .patch(`/questions/${question_id}/unlike`);

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    });

    it('should minus the question helpful by 1', async () => {
      const [questions] = await getPool()
        .query<RowDataPacket[]>(`SELECT helpful FROM questions WHERE id = ?`, question_id);

      expect(questions[0].helpful).toBe(0);
    });
  });

  describe('PATCH /questions/:question_id/report', () => {
    // reuse the last question
    const question_id = generatedQuestionIds.at(-1);

    it('should respond with 2xx status code when succeed', async () => {
      // first of all, make sure this question_id has 0 reported
      const [questions] = await getPool()
        .query<RowDataPacket[]>(`SELECT reported FROM questions WHERE id = ?`, question_id);

      expect(questions[0].reported).toBe(0);

      const response = await request(app)
        .patch(`/questions/${question_id}/report`);

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    });

    it('should minus the question reported by 1', async () => {
      const [questions] = await getPool()
        .query<RowDataPacket[]>(`SELECT reported FROM questions WHERE id = ?`, question_id);

      expect(questions[0].reported).toBe(1);
    });
  });

  describe('GET /questions', () => {
    const allLikeCounts: Array<number> = [];

    beforeAll(async () => {
      for (let i = 1; i <= 20; i++) {
        // post fake data
        const response = await request(app).post('/questions').send({
          product_id: 2**30,
          body: `test${i}`,
          asker_name: `Shennie${i}`,
          asker_email: `shennie${i}@gmail.com`
        });

        const question_id = response.body.question[0].id;
        generatedQuestionIds.push(question_id);

        const likeCounts = Math.floor(Math.random() * 20);
        allLikeCounts.push(likeCounts);

        for (let i = 0; i < likeCounts; i++) {
          await request(app).patch(`/questions/${question_id}/like`);
        }

        await setTimeout(1000);
      }

      allLikeCounts.sort((a, b) => b - a);
    });

    describe('When succeed:', () => {
      it('should get a status code of 200', async () => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**30,
            sortBy: 'helpful',
            currentPage: 1,
            pageLimit: 5,
          });

        expect(response.status).toBe(200);
      });

      it('should by default get 5 questions', async () => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**30,
            sortBy: 'helpful',
            currentPage: 1,
          });
        expect(response.body.questions.length).toBe(5);
      });

      it('should by default sort by [helpful]', async() => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**3,
            currentPage: 1,
            pageLimit: 5,
          });

        function checkSort (arr: any) {
          for (let i = 1; i < arr.length; i++) {
            if (arr[i].helpful > arr[i - 1].helpful) return false;
          }
          return true;
        }

        expect(checkSort(response.body.questions)).toBeTruthy();
      });

      it('should by default get the 1st page', async() => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**3,
            sortBy: 'helpful',
            pageLimit: 5,
          });

        const currPage = response.body.questions.map((q: any) => q.helpful);
        expect(currPage).toEqual(allLikeCounts.slice(0,5));
      });

      it('should get correct page limit when pageLimit parameter specified', async() => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**3,
            sortBy: 'helpful',
            pageLimit: 3,
            currentPage:1,
          });

        expect(response.body.questions.length).toBe(3);
      });

      it('should get nothing when currentPage exceed the last page', async() => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**3,
            sortBy: 'helpful',
            pageLimit: 5,
            currentPage: 2,
          });

        const currPage = response.body.questions.map((q: any) => q.helpful);
        expect(currPage).toEqual(allLikeCounts.slice(5, 10));
      });

      it('should sort by date_written when sortBy equals [date_written]', async() => {
        const response = await request(app).get('/questions')
          .query({
            product_id: 2**3,
            sortBy: 'date_written',
            pageLimit: 5,
            currentPage: 1,
          });

        function checkSort (arr: any) {
          for (let i = 1; i < arr.length; i++) {
            if (arr[i].date_written > arr[i - 1].date_written) return false;
          }
          return true;
        }

        expect(checkSort(response.body.questions)).toBeTruthy();
      });


    });

    describe('When failed', () => {
      it('should raise 400 error when missing required parameters', async () => {
        const response = await request(app)
          .get('/questions')
          .query({
            // missing required product_id parameter
            sortBy: 'helpful',
            currentPage: 1,
            pageLimit: 5
          });

        expect(response.status).toBe(400);
      });

      it('should raise 400 error when parameters in wrong data type', async () => {
        const response = await request(app)
          .get('/questions')
          .query({
            product_id: 1,
            sortBy: 'thumbUp', // must be 'helpful' or 'date_written'
            currentPage: 0, // page must integer bigger than one
            pageLimit: 'pageLimist must be an Integer'
          });

        expect(response.status).toBe(400);
      });

      it('should respond with error format like { error: [errorObj] }', async () => {
        const response = await request(app)
        .get('/questions')
        .query({ product_id: 0 }); // a random bad request body

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBeInstanceOf(Array);
      });

      it("errorObj should be like { type = 'validation', message: string } when 400 error", async () => {
        const response = await request(app)
        .get('/questions')
        .query({ product_id: 0 }); // a random bad request body

        expect(response.body.error[0]).toHaveProperty('type', 'Validation');
        expect(response.body.error[0]).toHaveProperty('message');
      });
    });

  });

  // just delete all of the generate questions id, while testing the delete functionality
  describe('DELETE /questions/:question_id', () => {
    let responses: Response[];

    beforeAll(async () => {
      const promises = generatedQuestionIds.map(id => {
        return request(app).delete(`/questions/${id}`);
      });

      responses = await Promise.all(promises);
    });

    it('should respond with 204 when deleted successfully', async () => {
      expect(responses.every(res => res.status === 204)).toBeTruthy();
    });

    it('should delete those questions from databases', async () => {
      const promises = generatedQuestionIds.map(id => {
        return getPool().query<RowDataPacket[]>('SELECT * FROM questions WHERE id = ?', id);
      });

      const results = await Promise.all(promises);

      expect(results.every(res => res[0].length === 0)).toBeTruthy();
    });
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



