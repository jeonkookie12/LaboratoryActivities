import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';  
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';

/**
 * Root application module
 * Configures the main application dependencies, database connection, and feature modules
 */
@Module({
  imports: [
    // Configure global ConfigModule to access environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configure TypeORM database connection to MySQL
    // Uses environment variables with fallback defaults
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'blog_platform',
      entities: [User, Post, Comment], // Register entity classes
      synchronize: true, // Automatically sync database schema (use with caution in production)
    }),

    // Import feature modules
    AuthModule,      // Authentication and authorization functionality
    PostsModule,     // Blog post management functionality
    CommentsModule,  // Comment management functionality
  ],
})
export class AppModule {}
