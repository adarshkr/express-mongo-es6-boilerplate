import httpStatus from 'http-status';
import { expect } from 'chai';
import { some, omitBy, isNil } from 'lodash';
import request from 'supertest';

import app from '../src/index';
import Post from '../src/api/models/post';

/**
 * root level hooks
 */

async function format(post) {
    const formated = post;

    // get posts from database
    const dbUser = (await Post.findOne({ title: post.title })).transform();

    // remove null and undefined properties
    return omitBy(dbUser, isNil);
}

describe('Posts API', async () => {
    let dbPosts;
    let post;

    beforeEach(async () => {
        dbPosts = {
            post1: {
                title: 'title1',
                category: 'category1',
                author: 'author1'
            },
            post2: {
                title: 'title2',
                category: 'category2',
                author: 'author2'
            },
        };
        post = {
            title: 'title3',
            category: 'category3',
            author: 'author3'
        }
        await Post.remove({});
        await Post.insertMany([dbPosts.post1, dbPosts.post2]);
    });

    describe('POST /posts', () => {
        it('should create a new post when request is ok', () => {

            return request(app)
                .post('/posts')
                .send(post)
                .expect(httpStatus.CREATED)
                .then((res) => {
                    expect(res.body.title).to.be.equal('title3');
                });
        });

        it('should report error when title already exists', () => {
            post.title = 'title1';

            return request(app)
                .post('/posts')
                .send(post)
                .expect(httpStatus.CONFLICT)
                .then((res) => {
                    const { field } = res.body.errors[0];
                    const { location } = res.body.errors[0];
                    const { messages } = res.body.errors[0];
                    expect(field).to.be.equal('');
                    expect(location).to.be.equal('body');
                    expect(messages).to.include('Already Exists');
                });
        });
        it('should report error when title is not provided', () => {
            delete post.title;

            return request(app)
                .post('/posts')
                .send(post)
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    const { field } = res.body.errors[0];
                    expect(field).is.equal('title');
                });
        });
    })

    describe('GET /posts', () => {
        it('should get all posts', () => {
            return request(app)
                .get('/posts')
                .expect(httpStatus.OK)
                .then(async (res) => {
                    const post1 = format(dbPosts.post1);
                    const post2 = format(dbPosts.post2);

                    const includesPost1 = some(res.body, post1);
                    const includesPost2 = some(res.body, post2);

                    // before comparing it is necessary to convert String to Date
                    res.body[0].createdAt = new Date(res.body[0].createdAt);
                    res.body[1].createdAt = new Date(res.body[1].createdAt);

                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
                    expect(includesPost1).to.be.true;
                    expect(includesPost2).to.be.true;
                });
        });

        it('should filter posts', () => {
            return request(app)
                .get('/posts')
                .query({ title: dbPosts.post1.title })
                .expect(httpStatus.OK)
                .then((res) => {
                    const post = format(dbPosts.post1);
                    const includespost1 = some(res.body, post);

                    // before comparing it is necessary to convert String to Date
                    res.body[0].createdAt = new Date(res.body[0].createdAt);

                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                    expect(includespost1).to.be.true;
                });
        });
    })

    describe('GET /posts/:postId', () => {
        it('should get post', async () => {
            const id = (await Post.findOne({}))._id;

            return request(app)
                .get(`/posts/${id}`)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.include(dbPosts.post1);
                });
        });
        it('should report error "Post does not exist" when posy does not exists', () => {
            return request(app)
                .get('/posts/56c787ccc67fc16ccc1a5e92')
                .expect(httpStatus.NOT_FOUND)
                .then((res) => {
                    expect(res.body.code).to.be.equal(404);
                    expect(res.body.message).to.be.equal('Post does not exist');
                });
        });
    })

    describe('PUT /post/:postId', () => {
        it('should replace post', async () => {
            const id = (await Post.findOne(dbPosts.post1))._id;

            return request(app)
                .put(`/posts/${id}`)
                .send(post)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.include(post);
                });
        });
    })

    describe('PATCH /posts/:postId', () => {
        it('should update post', async () => {
            const id = (await Post.findOne(dbPosts.post1))._id;
            const { category } = post;

            return request(app)
                .patch(`/posts/${id}`)
                .send({ category })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.category).to.be.equal(category);
                    expect(res.body.author).to.be.equal(dbPosts.post1.author);
                });
        });
    })

    describe('DELETE /post', () => {
        it('should delete post', async () => {
            const id = (await Post.findOne({}))._id;

            return request(app)
                .delete(`/posts/${id}`)
                .expect(httpStatus.NO_CONTENT)
                .then(() => request(app).get('/posts'))
                .then(async () => {
                    const posts = await Post.find({});
                    expect(posts).to.have.lengthOf(1);
                });
        });
    })

})