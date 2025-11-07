// src/notes/notes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private usersService: UsersService,   
  ) {}

  async findAll(userId: number): Promise<Note[]> {
    return this.notesRepository.find({
      where: { user: { id: userId } },
      order: { pinned: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const user = await this.usersService.findOne(userId);
    const note = this.notesRepository.create({
      ...createNoteDto,
      user,                     
      created_at: new Date(),
    });
    return this.notesRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number): Promise<Note> {
    const note = await this.findOne(id, userId);
    Object.assign(note, updateNoteDto);
    return this.notesRepository.save(note);
  }

  async delete(id: number, userId: number): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.delete(note.id);
  }
}