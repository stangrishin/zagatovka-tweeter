const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const faker = require('faker');
const Twits = require('./models/twit');
const User = require('./models/user');
const dbConnect = require('./config/db');

dbConnect();

async function seed(num) {
  for (let index = 0; index < num; index++) {
    const truePass = 'aaaa';
    const user = new User({
      email: faker.internet.email(),
      password: await bcrypt.hash(truePass, 10),
      name: faker.name.firstName(),
    });
    await user.save();
    for (let i = 0; i < 5; i++) {
      const twit = new Twits({
        img:
          'https://rlv.zcache.com/anonymous_mask_classic_round_sticker-r1f44743090f54cd995cf1a560de89582_0ugmp_8byvr_704.jpg',
        dateCreate: new Date(),
        content: faker.lorem.paragraphs(),
        authorName: user.name,
        authorID: user._id,
      });
      await twit.save();
    }
  }
}

seed(5);
