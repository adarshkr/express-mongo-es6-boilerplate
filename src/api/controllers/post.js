import httpStatus from 'http-status';
import { omit } from 'lodash';
import Post from '../models/post';

import { handler as errorHandler } from '../middlewares/error';
import { generateError } from '../utils/generateError';

/**
 * Load post and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const post = await Post.get(id);
        req.locals = { post };
        return next();
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

/**
 * Get post
 * @public
 */
exports.get = (req, res) => {
    res.json(req.locals.post.transform())
};


/**
 * Create new post
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const post = new Post(req.body);
        const savedPost = await post.save();
        res.status(httpStatus.CREATED);
        res.json(savedPost.transform());
    } catch (error) {
        next(generateError(error));
    }
};


/**
 * Replace existing post
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
        const { post } = req.locals;
        const newPost = new Post(req.body);
        const newPostObject = omit(newPost.toObject(), ['_id']);
        await post.update(newPostObject, { override: true, upsert: true });
        const savedPost = await Post.findById(post._id);
        res.json(savedPost.transform());
    } catch (error) {
        next(generateError(error));
    }
};

/**
 * Update existing post
 * @public
 */
exports.update = (req, res, next) => {
    const post = Object.assign(req.locals.post, req.body);
    post.save()
        .then(savedPost => res.json(savedPost.transform()))
        .catch(e => next(generateError(e)));
};

/**
 * Get post list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const posts = await Post.list(req.query);
        const transformedPosts = posts.map(post => post.transform());
        res.json(transformedPosts);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete post
 * @public
 */
exports.remove = (req, res, next) => {
    const { post } = req.locals;

    post.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch(e => next(e));
};