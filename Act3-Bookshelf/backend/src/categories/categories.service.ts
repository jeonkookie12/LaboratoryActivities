import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateBookDto } from '../books/dto/create-book.dto';
import { UpdateBookDto } from '../books/dto/update-book.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Book } from '../book.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findAll() {
    return this.categoryRepository.find({ relations: ['books'] });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const normalizedGenre = createCategoryDto.genre.toUpperCase().trim();
    const existing = await this.categoryRepository.findOne({ where: { genre: normalizedGenre } });
    if (existing) throw new NotFoundException(`Category ${normalizedGenre} already exists`);
    const category = this.categoryRepository.create({ genre: normalizedGenre });
    return this.categoryRepository.save(category);
  }

  async findOne(genre: string) {
    const normalizedGenre = genre.toUpperCase().trim();
    const category = await this.categoryRepository.findOne({
      where: { genre: normalizedGenre },
      relations: ['books'],
    });
    if (!category) throw new NotFoundException(`Category ${genre} not found`);
    return category;
  }

  async addBook(createBookDto: CreateBookDto) {
    const category = await this.findOne(createBookDto.genre);
    const book = this.bookRepository.create({
      title: createBookDto.title,
      author: createBookDto.author,
      description: createBookDto.description,
      genre: createBookDto.genre.toUpperCase(),
      datePublished: new Date().toISOString().split('T')[0],
      category,
    });
    return this.bookRepository.save(book);
  }

  async updateBook(genre: string, id: number, updateBookDto: UpdateBookDto) {
    const category = await this.findOne(genre);
    const book = await this.bookRepository.findOne({ where: { id, genre: genre.toUpperCase() } });
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    Object.assign(book, {
      title: updateBookDto.title || book.title,
      author: updateBookDto.author || book.author,
      description: updateBookDto.description || book.description,
    });
    return this.bookRepository.save(book);
  }

  async deleteBook(genre: string, id: number) {
    const category = await this.findOne(genre);
    const book = await this.bookRepository.findOne({ where: { id, genre: genre.toUpperCase() } });
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    await this.bookRepository.delete(id);
    return { message: `Book with id ${id} deleted successfully` };
  }

  async update(genre: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(genre);
    const normalizedNewGenre = updateCategoryDto.genre.toUpperCase().trim();
    const existing = await this.categoryRepository.findOne({ where: { genre: normalizedNewGenre } });
    if (existing && existing.genre !== genre.toUpperCase()) {
      throw new NotFoundException(`Category ${normalizedNewGenre} already exists`);
    }
    category.genre = normalizedNewGenre;
    return this.categoryRepository.save(category);
  }

  async delete(genre: string) {
    const normalizedGenre = genre.toUpperCase().trim();
    const category = await this.findOne(normalizedGenre); 
    try {
      await this.categoryRepository.delete({ genre: normalizedGenre });
      return { message: `Category ${genre} and associated books deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete category: ${error.message}`);
    }
  }
}