import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BooksService {
  constructor(private readonly categoriesService: CategoriesService) {}

  async findAll() {
    return this.categoriesService.findAll();
  }

  async create(createBookDto: CreateBookDto) {
    return this.categoriesService.addBook(createBookDto);
  }

  async update(genre: string, id: number, updateBookDto: UpdateBookDto) {
    return this.categoriesService.updateBook(genre, id, updateBookDto);
  }

  async delete(genre: string, id: number) {
    return this.categoriesService.deleteBook(genre, id);
  }
}