import teamsController from '../../controllers/teamsController.js';

// Mocking Express request and response objects
const mockRequest = (body, file) => ({
  body,
  file,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('addTeam', () => {
  // it('should add a new team successfully', async () => {
  //   const req = mockRequest(
  //     {
  //       name: 'Team A',
  //       city: 'City A',
  //       year: 2023,
  //       stadium: 'Stadium A',
  //     },
  //     {
  //       filename: 'teamA.jpg',
  //     }
  //   );

  //   const res = mockResponse();

  //   const add = await teamsController.addTeam(req, res);
  //   console.log(add, 'add');

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     status: 'success',
  //     statusCode: 200,
  //     message: 'Success add team',
  //     data: expect.objectContaining({
  //       name: 'Team A',
  //       city: 'City A',
  //       year: 2023,
  //       stadium: 'Stadium A',
  //       photo: 'http://localhost:3000/teamA.jpg',
  //     }),
  //   });
  // });

  it('should return an error if the team name is not provided', async () => {
    const req = mockRequest(
      {
        // No name provided
        city: 'City B',
        year: 2022,
        stadium: 'Stadium B',
      },
      {
        filename: 'teamB.jpg',
      }
    );

    const res = mockResponse();

    await teamsController.addTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 400,
      message: 'Team is available',
    });
  });

  it('should return a server error for unexpected errors', async () => {
    const req = mockRequest(
      {
        name: 'Team C',
        city: 'City C',
        year: 2021,
        stadium: 'Stadium C',
      },
      {
        filename: 'teamC.jpg',
      }
    );

    const res = mockResponse();

    // Simulate an unexpected error
    teamsController.teams.create = jest.fn(() => {
      throw new Error('Unexpected error');
    });

    await teamsController.addTeam(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: expect.any(String),
    });
  });
});
