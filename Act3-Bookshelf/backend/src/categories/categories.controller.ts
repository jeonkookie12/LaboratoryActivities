import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':genre')
  async update(@Param('genre') genre: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(genre, updateCategoryDto);
  }

  @Delete(':genre')
  async delete(@Param('genre') genre: string) {
    return this.categoriesService.delete(genre);
  }
}