import { MikroORM } from '@mikro-orm/core';
// import { Post } from './entities/Post';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

async function main() {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [HelloResolver, PostResolver],
    }),
    context: () => ({ em: orm.em }),
  });

  server.applyMiddleware({ app });

  app.listen(4000);
}

main().catch(console.error);
