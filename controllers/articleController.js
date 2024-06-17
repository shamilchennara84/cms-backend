const Article = require("../models/Article");

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

const getArticles = async (req, res, page = 1, limit = 10) => {
  try {
    const articles = await Article.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "username");
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error fetching articles" }); // More specific
  }
};

const authorizeArticle = async (req, res, articleId) => {
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    return article;
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error retrieving article" }); // More specific
  }
};

exports.createArticle = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newArticle = new Article({
      title,
      content,
      author: req.user.id,
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    // Handle validation errors more specifically if applicable
    res.status(500).json({ msg: "Error creating article" }); // More specific
  }
};

exports.getArticles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Allow pagination through query params
  getArticles(req, res, page, limit);
};

exports.getArticle = async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ msg: "Invalid article ID" });
  }

  try {
    const article = await Article.findById(id).populate("author", "username");
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error retrieving article" }); // More specific
  }
};

exports.updateArticle = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ msg: "Invalid article ID" });
  }

  try {
    const article = await authorizeArticle(req, res, id); // Reusable function

    article.title = title;
    article.content = content;

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (err) {
    console.error(err.message);
    // Handle validation errors more specifically if applicable
    res.status(500).json({ msg: "Error updating article" }); // More specific
  }
};

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ msg: "Invalid article ID" });
  }

  try {
    const article = await authorizeArticle(req, res, id); // Reusable function

    await article.remove();
    res.json({ msg: "Article removed" });
  } catch (err) {
    console.error;
    // Handle validation errors more specifically if applicable
    res.status(500).json({ msg: "Error deleteing article" }); // More specific
  }
};

