import express from 'express';
import teamsController from '../controllers/teamsController.js';
import upload from '../helper/loginHelper.js';
import userController from '../controllers/userController.js';

const teamsRouter = express.Router();

teamsRouter.post('/', upload.single('photo'), teamsController.addTeam);
teamsRouter.get('/', teamsController.getTeam);
teamsRouter.get('/:id', teamsController.getTeamById);
teamsRouter.put('/:id', upload.single('photo'), teamsController.updateTeam);
teamsRouter.delete('/:id', teamsController.deleteTeam);

export default teamsRouter;
