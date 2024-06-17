const express = require("express");
const router = express.Router();
const passport = require("passport");
const articleController  = require("../controllers/articles");

router.post("/", passport.authenticate("jwt", { session: false }), articleController.createArticle);

router.get("/", articleController.getArticles);

router.get("/:id", articleController.getArticle);

router.put("/:id", passport.authenticate("jwt", { session: false }), articleController.updateArticle);

router.delete("/:id", passport.authenticate("jwt", { session: false }), articleController.deleteArticle);


module.exports = router;
