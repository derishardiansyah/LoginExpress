// import request from 'supertest';
// import app from '../../server.js';

// describe('File Upload API', () => {
//   it('should upload a file successfully', async () => {
//     const response = await request(app).post('/upload').attach('file', '../../public/photo');

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('File uploaded successfully');
//   });

//   it('should handle missing file', async () => {
//     const response = await request(app).post('/upload');

//     expect(response.status).toBe(500);
//   });
// });
