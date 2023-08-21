import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import teamsRouter from './routes/teamsRoute.js';
import userRouter from './routes/userRoute.js';

const port = process.env.PORT || 3000;
const app = express();

// untuk menangkap json
app.use(express.json());
// untuk menangkap request body
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// kalau ubah models harus sync dinyalakan
db.sync()
  .then(() => {
    console.log('Database connected!');
  })
  .catch((err) => {
    console.log('Failed to sync database', err);
  });

app.use('/api/teams', teamsRouter);
app.use('/auth', userRouter);
app.use(express.static('public/photo'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
