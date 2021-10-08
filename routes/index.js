const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middlewares/auth");
const Post = require("../models/Post");

router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.displayName,
      profileImg: String(req.user.image),
      posts,
    });
  } catch (err) {
    console.error(err);
    res.redirect("error/500");
  }
});

module.exports = router;
