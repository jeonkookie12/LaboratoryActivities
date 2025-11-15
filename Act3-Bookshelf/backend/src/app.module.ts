import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './category.entity';
import { Book } from './book.entity';

/**
 * Root application module
 * Configures the main application dependencies and database connection
 */
@Module({
  imports: [
    // Configure TypeORM database connection to MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', 
      database: 'bookshelf',
      entities: [Category, Book], // Register entity classes
      synchronize: true, // Automatically sync database schema (use with caution in production)
    }),
    // Import feature modules
    BooksModule,        // Book management functionality
    CategoriesModule,  // Category/genre management functionality
  ],
})
export class AppModule {}