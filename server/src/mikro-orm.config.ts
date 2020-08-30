import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { __production__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: 'lireddit',
  user: 'postgres',
  password: 'postgres',
  debug: !__production__,
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0];
