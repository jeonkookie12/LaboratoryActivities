import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';

/**
 * Comments module
 * Configures the comments feature module with its dependencies
 */
@Module({
  // Register Comment and Post entities with TypeORM for this module
  imports: [TypeOrmModule.forFeature([Comment, Post])], 
  // Register the CommentsService as a provider
  providers: [CommentsService],
  // Register the CommentsController to handle HTTP requests
  controllers: [CommentsController],
})
export class CommentsModule {}