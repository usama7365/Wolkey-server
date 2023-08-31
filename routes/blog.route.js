const express = require("express");
const router = express.Router();
const { getBlogController, getSingleBlogController, getPrevBlogDetailController, getLatestBlogDetailController, getBlogSearchController, getBlogSearchCategoryController,likeBlogController } = require("../controllers/blog.controller");

router.get("/blogs", getBlogController);
router.get("/blog-detail/:id", getSingleBlogController); 
router.get("/prev-blog-detail/:id", getPrevBlogDetailController);
router.get("/latest-blog-detail/:id", getLatestBlogDetailController);
router.get("/blog-search/:keyword", getBlogSearchController);
router.get("/blog-search-category/:cate_id", getBlogSearchCategoryController);
router.post("/like-blog/:id", likeBlogController);

module.exports = router;