import { ApolloServer } from 'apollo-server';

import mongoose from 'mongoose';

import { MONGOOSE_URI } from './config.js';

import typeDefs from './Graphql/TypeDefs.js';

import resolvers from './Graphql/resolvers/index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose.connect(
  MONGOOSE_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  err => console.log(err ? err : 'Connected Atlas')
);

server.listen({ port: 5000 }).then(res => {
  console.log(`Server Running at ${res.url}`);
});
