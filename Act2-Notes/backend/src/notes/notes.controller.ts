import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/users/users.entity';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  notesRepository: any;
  constructor(private notesService: NotesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.notesService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(+id, req.user);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Request() req) {
    return this.notesService.update(+id, updateNoteDto, req.user);
  }


  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    console.log('🗑️ Delete hit with id =', id, 'user =', req.user);
    await this.notesService.delete(+id, req.user);
    return { message: 'Note deleted' };
  }
}