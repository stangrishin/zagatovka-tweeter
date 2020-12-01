const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Twit = require('../models/twit');
const { checkAuth } = require('../middleweare/auth');
const { auth } = require('../middleweare/auth');
const { deleteCheck } = require('../middleweare/auth');
const { editCheck } = require('../middleweare/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  // if (req.session?.user?.id) {
  //   return res.redirect('/home');
  // }
  const twit = await Twit.find();
  twit.sort((a, b) => b.dateCreate - a.dateCreate);

  return res.render('home', { twit });
});

router.get('/registration', (req, res) => {
  // if (req.session?.user?.id) {
  //   return res.redirect('/home');
  //   // return res.redirect(`/home/${req.session.user.id}`);
  // }
  res.render('registration/registration');
});

router.get('/signIn', (req, res) => {
  if (req.session?.user?.id) {
    return res.redirect(`/home/${req.session.user.id}`);
  }
  res.render('registration/signIn');
});

router.get('/home/:id', checkAuth, (req, res) => {
  res.render('home');
});

router.get('/signout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return res.render('error', { error: err });
    res.clearCookie('sid');
    res.redirect('/');
  });
});
// router.get('/profile/:id', checkAuth, async (req, res, next) => {
//   const { id } = req.session.user;
//   const currentUser = await User.findOne({ _id: id });
//   res.render('profile', { currentUser, id });
// });

router.get('/profile', auth, async (req, res) => {
  const { id } = res.locals;
  const twit = await Twit.find({ authorID: id });
  twit.sort((a, b) => b.dateCreate - a.dateCreate);

  return res.render('profile', { twit });
});

router.get('/edit/:id', editCheck, async (req, res) => {
  const postID = req.params.id;
  const post = await Twit.findOne({ _id: postID });
  res.render('edit', { post });
});

router.post('/registration', async (req, res) => {
  const { email, password, name } = req.body;
  if (email && password) {
    try {
      const pass = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: pass, name });
      await newUser.save();
      req.session.user = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      };
      return res.redirect('/');
    } catch (error) {
      return res.render('error', { error });
    }
  } else {
    res.send('Заполните все поля!');
  }
});

router.post('/signIn', async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const currentUser = await User.findOne({ email });
      if (currentUser) {
        if (await bcrypt.compare(password, currentUser.password)) {
          req.session.user = {
            id: currentUser._id,
            email: currentUser.email,
            name: currentUser.name,
          };
          return res.redirect('/');
        }
        res.send('Не верные логин или пароль!');
      }
      res.send('Не верные логин или пароль!');
    } catch (error) {
      return res.render('error', { error });
    }
  } else {
    res.send('Заполните все поля!');
  }
});

router.post('/newPost', auth, async (req, res) => {
  const { content, img } = req.body;
  if (content) {
    const { id } = res.locals;
    const { name } = res.locals;
    const dateCreate = Date.now();
    const newPost = new Twit({
      img,
      authorID: id,
      authorName: name,
      content,
      dateCreate,
    });
    await newPost.save();
    return res.redirect('/');
  }
  return res.sendStatus(418);
});

// router.post('/profile/:id', checkAuth, async (req, res, next) => {
//   const { name, email } = req.body;
//   if (email && name) {
//     try {
//       const currentUser = await User.findOne({ _id: req.params.id });
//       if (req.body.password) {
//         const pass = await bcrypt.hash(req.body.password, 10);
//         currentUser.password = pass;
//       }
//       currentUser.email = email;
//       currentUser.name = name;
//       await currentUser.save();
//       res.redirect(`/home/${req.params.id}`);
//     } catch (error) {
//       res.send('Ошибка ввода!', error);
//     }
//   }
// });

router.post('/addLike', async (req, res) => {
  const id = req.body.articleID;
  const post = await Twit.findById(id);
  // if (!post.likes.includes(res.locals.id)) {
  //   post.likes.push(res.locals.id);
  // }
  post.likes.push(res.locals.id);
  /// ////////////////
  await post.save();
  const newPost = post.likes.length;
  // const newValue = await Twit.findById(id);
  res.json({ newPost });
});
router.delete('/delete', deleteCheck, async (req, res) => {
  const id = req.body.articleID;
  try {
    await Twit.findOneAndDelete({ _id: id });
    return res.sendStatus(200);
  } catch (error) {
    res.send('Ошибка удаления!');
  }
});
router.post('/edit/:id', editCheck, async (req, res) => {
  const { content, img } = req.body;
  const { id } = req.params;
  const editPost = await Twit.findOne({ _id: id });
  editPost.content = content;
  editPost.img = img;
  await editPost.save();
  const twit = Twit;
  res.redirect('/profile');
});

module.exports = router;
