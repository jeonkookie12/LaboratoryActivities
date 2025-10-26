import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { BooksService } from './books.service'; 
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll() {
    const categories = await this.booksService.findAll();
    return categories.flatMap((cat) => cat.books.map((book) => ({ ...book, genre: cat.genre })));
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Patch(':genre/:id')
  async update(
    @Param('genre') genre: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(genre, id, updateBookDto);
  }

  @Delete(':genre/:id')
  async delete(@Param('genre') genre: string, @Param('id', ParseIntPipe) id: number) {
    return this.booksService.delete(genre, id);
  }
}