import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CategoriesModule } from '../categories/categories.module';
import { Book } from '../book.entity';
import { Category } from '../category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Category]), CategoriesModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}