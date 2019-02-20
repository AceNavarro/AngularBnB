const User = require("../models/user"),
      jwt = require("jsonwebtoken"),
      config = require("../config"),
      { normalizeErrors } = require("../helpers/mongoose");


exports.getUser = async function (req, res) {
  const id = req.params.id;
  const user = res.locals.user;

  try {
    if (id === user.id) {
      // Return all info
      const foundUser = await User.findById(id);
      return res.json(foundUser);
    } else {
      // Return partial info
      const foundUser = await User.findById(id)
        .select("-revenue -stripeCustomerId -password");
      return res.json(foundUser);
    }
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


exports.updateUser = async function (req, res) {
  const userData = req.body;
  const userId = req.params.id
  const user = res.locals.user;

  // Check for correct user
  if (user.id !== userId) {
    return res.status(422).send({ errors: [{ 
      title: "Invalid user", 
      detail: "Cannot update profile of another user." }]});
  }

  try {
    // Update the user
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, 
                                                    { $set: { 
                                                        username: userData.username, 
                                                       email: userData.email 
                                                    }},
                                                    { new: true });
    res.locals.user = updatedUser;                                                
    return res.json(updatedUser);
    
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


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
        detail: "Account does not exist. Please register a new account." }]});
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

  if (!username || !email || !password) {
    return res.status(422).send({ errors: [{ 
      title: "Data missing", 
      detail: "Provide username, email, and password." }]});
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({ errors: [{ 
      title: "Invalid password", 
      detail: "Password does not match with confirmation." }]});
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