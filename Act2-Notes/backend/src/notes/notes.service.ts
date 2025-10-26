import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '../users/users.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async findAll(user: User): Promise<Note[]> {
    return this.notesRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number, user: User): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async create(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      user,
      created_at: new Date(),
    });
    return this.notesRepository.save(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User): Promise<Note> {
    console.log('🪶 update called with:', id, updateNoteDto);
    const note = await this.findOne(id, user);
    Object.assign(note, updateNoteDto);
    const saved = await this.notesRepository.save(note);
    console.log('✅ after save:', saved);
    return saved;
  }


  async delete(id: number, user: User): Promise<void> {
    const note = await this.findOne(id, user);
    await this.notesRepository.delete(note.id);
  }
}