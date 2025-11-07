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
    return this.notesService.findAll(req.user.sub);  
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(+id, req.user.sub);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.sub);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Request() req) {
    return this.notesService.update(+id, updateNoteDto, req.user.sub);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.notesService.delete(+id, req.user.sub);
    return { message: 'Note deleted' };
  }
}