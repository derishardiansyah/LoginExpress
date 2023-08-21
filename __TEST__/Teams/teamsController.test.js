import teamsController from '../../controllers/teamsController.js'; // Gantikan dengan path yang benar
import { teams } from '../../database/db.js'; // Gantikan dengan path yang benar

jest.mock('../../database/db.js'); // Mock database module

describe('Teams Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a team', async () => {
    const req = {
      body: {
        name: 'Team A',
        city: 'City A',
        year: 2023,
        stadium: 'Stadium A',
      },
      file: { filename: 'image.jpg' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    teams.create.mockResolvedValue(req.body);

    await teamsController.addTeam(req, res);

    expect(teams.create).toHaveBeenCalledWith({
      name: 'Team A',
      city: 'City A',
      year: 2023,
      stadium: 'Stadium A',
      photo: 'http://localhost:3000/image.jpg',
    });
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      statusCode: 200,
      message: 'Success add team',
      data: req.body,
    });
  });

  it('should get all teams', async () => {
    const teamData = [{ name: 'Team A' }, { name: 'Team B' }];
    const res = {
      json: jest.fn(),
    };

    teams.findAll.mockResolvedValue(teamData);

    await teamsController.getTeam({}, res);

    expect(teams.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      statusCode: 200,
      message: 'Success get all teams',
      data: teamData,
    });
  });

  // Uji kasus lainnya sesuai dengan fungsi-fungsi lain dalam teamsController
});
