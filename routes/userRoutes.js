import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userSchema.js';
import Content from '../models/contentSchema.js';
import { isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/addcontent',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.body.user._id;
      const contentId = req.body.item._id;
      const user = await User.findById(userId);
      if (user) {
        if (user.likedContent.includes(contentId)) {
          res.status(400).json({
            message: 'you already added this series/movie to your list',
          });
        } else {
          await User.findByIdAndUpdate(userId, {
            $push: { likedContent: contentId },
          });
          res.status(200).json({ message: 'Content Added' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

userRouter.get(
  '/contentlist/:_id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params._id;
      const contents = await Content.find();
      const user = await User.findById(userId);
      const userlikedContent = [];
      if (user) {
        contents.forEach((content) => {
          if (user.likedContent.includes(content._id)) {
            userlikedContent.push(content);
          }
        });
        res.send(userlikedContent);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

userRouter.post(
  '/removecontent/:_id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params._id;
      const contentId = req.body.item._id;
      const user = await User.findById(userId);
      if (user) {
        if (user.likedContent.includes(contentId)) {
          await User.findByIdAndUpdate(userId, {
            $pull: { likedContent: contentId },
          });
          res.status(200).json({ message: 'Content Removed' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
);

export default userRouter;
