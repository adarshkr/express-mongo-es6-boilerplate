import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { omitBy, isNil } from 'lodash';

import APIError from '../utils/APIError';

/**
 * Post Schema
 * @private
 */

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        author: { type: String, required: true },
        category: { type: String }
    },
    {
        versionKey: false
    },
    {
        timestamps: true,
    }
);


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
postSchema.pre('save', async function save(next) {
    try {
        next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Methods
 */
postSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'title', 'author', 'category', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    }
});

/**
 * Statics
 */
postSchema.statics = {
    /**
    * Get Post
    *
    * @param {ObjectId} id - The objectId of post.
    * @returns {Promise<Post, APIError>}
    */
    async get(id) {
        try {
            let post;

            if (mongoose.Types.ObjectId.isValid(id)) {
                post = await this.findById(id).exec();
            }
            if (post) {
                return post;
            }

            throw new APIError({
                message: 'Post does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },
    /**
     * List of posts in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of post to be skipped.
     * @param {number} limit - Limit number of post to be returned.
     * @returns {Promise<Post[]>}
     */
    list({
    page = 1, perPage = 30, title
  }) {
        const options = omitBy({ title }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    }

}

/**
 * @typedef Post
 */
export default mongoose.model('Post', postSchema);