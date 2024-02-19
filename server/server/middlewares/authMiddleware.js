const Boom = require('boom');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Moment = require('moment');

const GeneralHelper = require('../helpers/generalHelper');

const signatureSecretKey = process.env.SIGN_SECRET_KEY || 'pgJApn9pJ8';

const fileName = 'server/middlewares/authMiddleware.js';

const validateToken = (request, reply, next) => {
  const { authorization } = request.headers;
  
  try {
    if(_.isEmpty(authorization)) { 
      throw Boom.unauthorized();
    }
  
    const token = authorization.split(' ')[1];
    const verifiedUser = jwt.verify(token, signatureSecretKey);
    if(_.isEmpty(verifiedUser) || !_.has(verifiedUser, 'exp') || !_.has(verifiedUser, 'userId')) {
      throw Boom.unauthorized();
    }

    const isTokenExpired = verifiedUser.exp < Moment().unix();
    if(isTokenExpired) {
      throw Boom.unauthorized();
    }

    request.header.login = verifiedUser;
    
    return next();
  } catch (err) {
    console.log([fileName, 'validateToken', 'ERROR'], { info: `${err}` });

    const isTokenExpiredErr = err?.name === 'TokenExpiredError';
    return reply.send(GeneralHelper.errorResponse(isTokenExpiredErr ? Boom.unauthorized('Token expired, please login again.') : err))
  }
}

module.exports = {
  validateToken
}