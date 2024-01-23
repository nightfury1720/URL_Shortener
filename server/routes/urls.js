import express from 'express';
import Url from '../models/urlModel.js';
import { nanoid } from 'nanoid';
import { validateUrl } from '../utils/utils.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const router = express.Router();

// Short URL Generator
router.post('/short', async (req, res) => {
  console.log("req res", req.body);
  const { origUrl } = req.body;
  const base = process.env.BASE;

  console.log("base", base);
  const urlId = nanoid();
  if (validateUrl(origUrl)) {
    try {
      let url = await Url.findOne({ origUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          origUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        console.log("url", url);
        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
});

export default router;