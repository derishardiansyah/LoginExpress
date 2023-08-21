import responseHelper from '../../helper/responseHelper.js';

describe('responseHelper function', () => {
  test('should return success response', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const data = { id: 1, name: 'John' };
    const status = 200;
    const message = 'Request successful';

    responseHelper(mockRes, status, data, message);

    expect(mockRes.status).toHaveBeenCalledWith(status);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'Success',
      statusCode: status,
      message,
      data,
    });
  });

  test('should return error response for 404 status', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const status = 404;

    responseHelper(mockRes, status);

    expect(mockRes.status).toHaveBeenCalledWith(status);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'Error',
      statusCode: status,
      message: 'Api Not Found',
    });
  });

  test('should return error response for other error statuses', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const status = 500;
    const message = 'Internal Server Error';

    responseHelper(mockRes, status, null, message);

    expect(mockRes.status).toHaveBeenCalledWith(status);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'Error',
      statusCode: status,
      message,
    });
  });
});
