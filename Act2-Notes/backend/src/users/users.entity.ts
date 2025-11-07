import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { Note } from '../notes/notes.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @Column({ name: 'private_password_hash', nullable: true })
  private_password_hash?: string;
}