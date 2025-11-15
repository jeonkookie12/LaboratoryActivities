import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { AuthModule } from '../auth/auth.module';

/**
 * Posts module
 * Configures the posts feature module with its dependencies
 * Exports PostsService for use in other modules
 */
@Module({
  // Register Post entity with TypeORM and import AuthModule for authentication
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  // Register the PostsController to handle HTTP requests
  controllers: [PostsController],
  // Register the PostsService as a provider
  providers: [PostsService],
  // Export PostsService so other modules can use it
  exports: [PostsService], 
})
export class PostsModule {}