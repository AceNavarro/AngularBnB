const User = require("../models/user"),
      jwt = require("jsonwebtoken"),
      config = require("../config/dev"),
      { normalizeErrors } = require("../helpers/mongoose");


exports.auth = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ errors: [{ 
      title: "Data missing", 
      detail: "Provide email and password." }]});
  }

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(422).send({ errors: [{ 
        title: "Invalid user", 
        detail: "User does not exist." }]});
    }

    if (user.isSamePassword(password)) {
      const token = jwt.sign({
          userId: user._id,
          username: user.username
        }, config.JWT_SECRET, { expiresIn: '1h' });
      return res.json(token);
    } else {
      return res.status(422).send({ errors: [{ 
        title: "Invalid password", 
        detail: "Incorrect email or password." }]});
    }
  } catch (err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
}


exports.register = async function (req, res) {
  const { username, email, password, passwordConfirmation } = req.body;

  if (!email || !password) {
    return res.status(422).send({ errors: [{ 
      title: "Data missing", 
      detail: "Provide email and password." }]});
  }

  if (password != passwordConfirmation) {
    return res.status(422).send({ errors: [{ 
      title: "Invalid password", 
      detail: "Password does not match." }]});
  }

  try {
    const user = await User.findOne({email});
    if (user) {
      return res.status(422).send({ errors: [{ 
        title: "Invalid email", 
        detail: "Email is already used by another user." }]});
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.json({ username, email });
  } catch (err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
}


exports.authMiddleware = async function(req, res, next) {
  const token = req.headers.authorization;
  if (!token) { return notAuthorized(res); }

  try {
    var userToken = parseToken(token);
  } catch(err) {
    return notAuthorized(res);
  }

  try {
    const user = await User.findById(userToken.userId);
    if (user) {
      res.locals.user = user;
      next();
    } else {
      return notAuthorized(res);
    }
  } catch (err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


function parseToken(token) {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET);
}

function notAuthorized(res) {
  return res.status(401).send({ errors: [{ 
    title: "Not authorized", 
    detail: "You need to login in order to proceed." }]});
}