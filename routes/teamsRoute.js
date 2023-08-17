import express from 'express';
import verifyToken from '../controllers/verifyTokenController.js';
import teamsController from '../controllers/teamsController.js';
import upload from '../helper/teamsHelper.js';

const teamsRouter = express.Router();

teamsRouter.post('/', verifyToken, upload.single('photo'), teamsController.addTeam);
teamsRouter.get('/', teamsController.getTeam);
teamsRouter.get('/:id', teamsController.getTeamById);
teamsRouter.put('/:id', upload.single('photo'), teamsController.updateTeam);
teamsRouter.delete('/:id', teamsController.deleteTeam);

export default teamsRouter;
