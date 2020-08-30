import {
  Resolver, Query, Ctx, Arg, Int, Mutation,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { Context } from '../types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx() { em }: Context,
  ): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('id', () => Int!) id: number,
    @Ctx() { em }: Context,
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    return post;
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: Context,
  ): Promise<Post> {
    const post = await em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  async updatedPost(
    @Arg('title', () => String, { nullable: true }) title: string,
    @Arg('id') id: number,
    @Ctx() { em }: Context,
  ): Promise<Post> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: Context,
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch {
      return false;
    }
  }
}
