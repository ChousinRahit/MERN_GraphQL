import { AuthenticationError, UserInputError } from 'apollo-server';
import Post from '../../models/Post.js';
import checkAuth from '../../utils/checkAuth.js';

export default {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);

        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        userName: user.userName,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.userName === post.userName) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError(
            "you're not allowed to perform this action"
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(_, { postId }, context) {
      const { userName } = checkAuth(context);

      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError('Post not found');
      } else {
        const userLikedIndex = post.likes.findIndex(
          l => l.userName === userName
        );

        if (userLikedIndex < 0) {
          post.likes.push({
            userName,
            createdAt: new Date().toISOString(),
          });
        } else {
          post.likes.splice(userLikedIndex, 1);
        }

        await post.save();
        return post;
      }
    },
  },
};
