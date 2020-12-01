const User = require('../models/user');
const Twits = require('../models/twit');

const checkAuth = async (req, res, next) => {
  const userId = req.session?.user?.id;

  if (userId === req.params.id) {
    const user = await User.findById(userId);
    if (user) {
      return next();
    }
    return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};

const auth = async (req, res, next) => {
  const userId = req.session?.user?.id;
  if (userId) {
    return next();
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};
const deleteCheck = async (req, res, next) => {
  const id = req.body.articleID;
  const post = await Twits.findOne({ _id: id });
  const userId = req.session?.user?.id;
  if (post.authorID.toString() === userId) {
    return next();
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};
const editCheck = async (req, res, next) => {
  const { id } = req.params;
  const post = await Twits.findOne({ _id: id });
  const userId = req.session?.user?.id;
  // console.log('userId', userId);
  // console.log('post.authorID', post.authorID);
  if (post.authorID.toString() === userId) {
    return next();
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};

module.exports = {
  checkAuth,
  auth,
  deleteCheck,
  editCheck,
};
