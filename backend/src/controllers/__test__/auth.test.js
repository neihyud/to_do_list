/* eslint-disable max-len */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {login, register} = require('../auth');
const Account = require('../../models/Account');
const AuthService = require('../../services/auth');

jest.mock('../../models/Account');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Login', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        username: 'admin',
        password: 'a123456',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return error if username or password is missing', async () => {
    const reqMissingData = {body: {}};
    await login(reqMissingData, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid username and/or password',
      errors: undefined,
    });
  });

  test('should return error if username not found', async () => {
    Account.findOne.mockResolvedValue(null);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: {username: 'Username not found'},
    });
  });

  test('should return error if password is invalid', async () => {
    Account.findOne
        .mockResolvedValue({username: 'admin', password: '12345'});
    bcrypt.compare.mockResolvedValue(false);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: {password: 'Invalid password'},
    });
  });

  test('should return success message and token if login successful',
      async () => {
        const mockUser = {_id: '123', username: 'admin'};
        const accessToken = 'mockAccessToken';
        Account.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(accessToken);

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Login successful',
          accessToken,
          user: mockUser,
        });
      });
});

describe('Register', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        username: 'admin',
        password: 'a123456',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return error if input validation fail', async () => {
    const errors = {username: 'Username is required'};
    AuthService.validateInputAuth = jest.fn().mockReturnValue(errors);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid username and/or password',
      errors,
    });
  });

  test('should return error if username is already taken', async () => {
    const reqTaken = {body: {username: 'admin', password: 'a123456'}};
    AuthService.validateInputAuth = jest.fn().mockReturnValue({});
    Account.findOne.mockResolvedValue({username: 'admin', password: 'a123456'});
    await register(reqTaken, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: {username: 'Username already taken'},
    });
  });

  test('should create new user and return success message and token if registration successful',
      async () => {
        Account.findOne.mockResolvedValue(null);

        jwt.sign.mockReturnValue('mockAccessToken');

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'User created successfully',
          accessToken: 'mockAccessToken',
          user: {username: 'admin'},
        });
      });

  test('should return internal server error if an error occurs during registration', async () => {
    Account.findOne.mockRejectedValue(new Error('Database error'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({success: false, message: 'Internal server error'});
  });
});
