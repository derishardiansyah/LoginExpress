import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import teamsRouter from './routes/teamsRoute.js';
import userRouter from './routes/userRoute.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

db.sync()
  .then(() => {
    console.log('Database connected!');
  })
  .catch((err) => {
    console.log('Failed to sync database', err);
  });

// Routes
app.use('/api/teams', teamsRouter);
app.use('/auth', userRouter);
app.use(express.static('public/photo'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
