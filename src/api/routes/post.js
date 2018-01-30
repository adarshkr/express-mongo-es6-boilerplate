import { Router } from 'express';
import controller from '../controllers/post';

const router = Router();

/**
 * Load post when API with postId route parameter is hit
 */
router.param('postId', controller.load);

router
    .route('/')
    /**
    * @api {get} /posts List of posts
    * @apiDescription Get a list of posts
    * @apiVersion 1.0.0
    * @apiName ListPosts
    * @apiGroup Post
    * 
    * @apiParam  {Number{1-}}         [page=1]     List page
    * @apiParam  {Number{1-100}}      [perPage=1]  Posts per page
    * @apiParam  {String}             [name]       Post's title
    *
    * @apiSuccess {Object[]} posts List of posts.
    *
    */
    .get(controller.list)
    /**
     * @api {post} /posts Create Post
     * @apiDescription Create a new post
     * @apiVersion 1.0.0
     * @apiName CreatePost
     *
     * @apiParam  {String}             title     Post's title
     * @apiParam  {String}             category  Post's category
     * @apiParam  {String}             author    Post's author name
     *
     * @apiSuccess (Created 201) {String}  id         Post's id
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .post(controller.create);

router
    .route('/:postId')
    /**
     * @api {get} posts/:id Get Post
     * @apiDescription Get post information
     * @apiVersion 1.0.0
     * @apiName GetPost
     *
     *
     * @apiSuccess {String}  title         Post's title
     * @apiSuccess {String}  author        Post's author
     * @apiSuccess {String}  category      Post's category
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Not Found 404)    NotFound     Post does not exist
     */
    .get(controller.get)
    /**
     * @api {put} posts/:id Replace Post
     * @apiDescription Replace the whole post article with a new one
     * @apiVersion 1.0.0
     * @apiName ReplacePost
     *
     * @apiParam  {String}             title       Post's email
     * @apiParam  {String}             author      Post's password
     * @apiParam  {String{..128}}      category    Post's name
     *
     * @apiSuccess {String}  title      Post's title
     * @apiSuccess {String}  author     Post's author
     * @apiSuccess {String}  category   Post's category
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .put(controller.replace)
    /**
     * @api {patch} posts/:id Update Post
     * @apiDescription Update some fields of a post
     * @apiVersion 1.0.0
     * @apiName UpdatePost
     *
     *
     * @apiParam  {String}             title       Post's title
     * @apiParam  {String              author      Post's author
     * @apiParam  {String              category    Post's category
     *
     * @apiSuccess {String}  id         Post's id
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Not Found 404)    NotFound     Post does not exist
     */
    .patch(controller.update)
    /**
     * @api {patch} posts/:id Delete Post
     * @apiDescription Delete a post
     * @apiVersion 1.0.0
     * @apiName DeletePost
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Not Found 404)    NotFound      Post does not exist
     */
    .delete(controller.remove);

module.exports = router;