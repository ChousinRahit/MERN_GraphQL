import postResolvers from './posts.js';
import usersResolvers from './users.js';
import commentsResolvers from './comments.js';
export default {
  Post: {
    likeCount: parent => parent.likes.length,
    commentCount: parent => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
