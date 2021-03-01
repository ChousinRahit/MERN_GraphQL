import { AuthenticationError, UserInputError } from 'apollo-server';
import Post from '../../models/Post.js';
import checkAuth from '../../utils/checkAuth.js';

export default {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { userName } = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not be empty',
          },
        });
      }
      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          userName,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else throw new UserInputError('post not found');
    },

    async deleteComment(_, { postId, commentId }, context) {
      const { userName } = checkAuth(context);

      console.log(userName);
      try {
        const post = await Post.findById(postId);

        if (post) {
          const commentIndex = post.comments.findIndex(
            com => com.id === commentId
          );

          if (commentIndex < 0) {
            throw new UserInputError('Comment not found');
          }

          if (post.comments[commentIndex].userName === userName) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          } else {
            throw new AuthenticationError(
              "you're not allowed to perform this operation"
            );
          }
        } else {
          throw new UserInputError('Post not Found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
