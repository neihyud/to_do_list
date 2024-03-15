const jwt = require('jsonwebtoken');
const config = require('../config/index');
const Account = require('../models/Account');

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({success: false, message: 'Not log in'});
  }

  const token = authHeader.split(' ')[1];

  // Unauthorized
  if (!token) {
    return res.status(401).json({success: false, message: 'Not log in'});
  }

  // 403: Forbidden
  try {
    const decoded = jwt.verify(token, config.accessTokenSecret);

    const account = await Account.findOne({_id: decoded.userId})
        .select('username').lean();

    if (!account) {
      return res.status(400)
          .json({success: false, message: 'User not found'});
    }

    req.userId = decoded.userId;
    req.account = account;

    return next();
  } catch (error) {
    return res.status(403).json({success: false, message: 'Invalid token'});
  }
};

module.exports = verifyToken;
