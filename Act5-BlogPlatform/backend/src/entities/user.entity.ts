import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

/**
 * User entity
 * Represents a user in the database
 * Maps to the 'users' table in MySQL
 * Each user can have multiple posts and comments
 */
@Entity('users')
export class User {
  /**
   * Primary key - auto-generated UUID for each user
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Username
   * Must be unique
   */
  @Column()
  username: string;

  /**
   * User's hashed password
   * Stored as bcrypt hash, never as plain text
   */
  @Column()
  password: string;

  /**
   * Timestamp when the user account was created
   * Maps to 'created_at' column in the database
   */
  @Column({ name: 'created_at' })
  createdAt: Date;

  /**
   * Timestamp when the user account was last updated
   * Maps to 'updated_at' column in the database
   */
  @Column({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * One-to-Many relationship with Post entity
   * One user can have many posts
   */
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  /**
   * One-to-Many relationship with Comment entity
   * One user can have many comments
   */
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}