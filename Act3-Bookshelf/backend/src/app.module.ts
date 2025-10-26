import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './category.entity';
import { Book } from './book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', 
      database: 'bookshelf',
      entities: [Category, Book],
      synchronize: true,
    }),
    BooksModule,
    CategoriesModule,
  ],
})
export class AppModule {}