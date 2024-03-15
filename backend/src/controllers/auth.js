const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const config = require('../config/index');
const AuthService = require('../services/auth');

exports.login = async (req, res) => {
  const {username = '', password = ''} = req.body;

  if (!username || !password) {
    return res
        .status(400)
        .json({
          success: false,
          message: 'Invalid username and/or password',
        });
  }

  const account = await Account.findOne({username});
  if (!account) {
    return res.status(400)
        .json({success: false, errors: {username: 'Username not found'}});
  }

  const passwordValid = await bcrypt.compare(password, account.password);

  if (!passwordValid) {
    return res.status(400)
        .json({success: false, errors: {password: 'Invalid password'}});
  }

  const accessToken = jwt.sign(
      {userId: account._id},
      config.accessTokenSecret,
  );

  res.status(200).json({
    success: true,
    message: 'Login successful',
    accessToken,
    user: account,
  });
};

exports.register = async (req, res) => {
  const {username, password} = req.body;

  const errors = AuthService.validateInputAuth({username, password});

  if (Object.keys(errors).length) {
    return res
        .status(400)
        .json({
          success: false,
          message: 'Invalid username and/or password',
          errors,
        });
  }

  const salt = 10;

  try {
    const user = await Account.findOne({username});

    if (user) {
      return res
          .status(400)
          .json({success: false, errors: {username: 'Username already taken'}});
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new Account({username, password: hashedPassword});
    await newUser.save();

    const accessToken = jwt.sign(
        {userId: newUser._id, role: newUser.role},
        process.env.ACCESS_TOKEN_SECRET,
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      accessToken,
      user: {
        username,
      },
    });
  } catch (error) {
    res.status(500).json({success: false, message: 'Internal server error'});
  }
};
