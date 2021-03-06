const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middlewares/auth");
const Post = require("../models/Post");

router.get("/add", ensureAuth, (req, res) => {
  res.render("posts/add", {
    profileImg: req.user.image,
  });
});

router.get("/", ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({ status: "publish" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("posts/index", { posts, profileImg: req.user.image });
  } catch (err) {
    res.render("error/500", { profileImg: req.user.image });
  }
});

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id })
      .populate("user")
      .lean();
    if (!post) {
      return res.render("error/404", { profileImg: req.user.image });
    }
    res.render("posts/show", { post, profileImg: req.user.image });
  } catch (err) {
    res.render("error/500", { profileImg: req.user.image });
  }
});

router.get("/user/:id", ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id, status: "publish" })
      .populate("user")
      .lean();
    if (!posts) {
      return res.render("error/404", { profileImg: req.user.image });
    }
    res.render("posts/userPosts", { posts, profileImg: req.user.image });
  } catch (err) {
    res.render("error/500", { profileImg: req.user.image });
  }
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean();
    if (!post) {
      return res.render("error/404", { profileImg: req.user.image });
    }
    if (post.user != req.user.id) {
      res.redirect("/posts");
    } else {
      res.render("posts/edit", { post, profileImg: req.user.image });
    }
  } catch (err) {
    res.render("error/500", { profileImg: req.user.image });
  }
});

router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Post.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    res.render("error/500", { profileImg: req.user.image });
  }
});

router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.render("error/404", { profileImg: req.user.image });
    }
    if (post.user != req.user.id) {
      res.redirect("/posts");
    } else {
      post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (err) {
    res.render("error/500", { profileImg: req.user.image });
  }
});

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    return res.render("error/500", { profileImg: req.user.image });
  }
});

module.exports = router;
