import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

/**
 * Post entity
 * Represents a blog post in the database
 * Maps to the 'posts' table in MySQL
 * Each post belongs to a user and can have multiple comments
 */
@Entity('posts')
export class Post {
  /**
   * Primary key - auto-generated UUID for each post
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Post title
   */
  @Column()
  title: string;

  /**
   * Post body/content
   */
  @Column()
  body: string;

  /**
   * Background color of the post
   * Randomly assigned from a predefined palette
   */
  @Column()
  color: string;

  /**
   * Timestamp when the post was created
   * Maps to 'created_at' column in the database
   */
  @Column({ name: 'created_at' })
  createdAt: Date;

  /**
   * Timestamp when the post was last updated
   * Maps to 'updated_at' column in the database
   */
  @Column({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Many-to-One relationship with User entity
   * Many posts can belong to one user (author)
   * Eager loading enabled to automatically load author
   */
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'author_id' }) 
  author: User;

  /**
   * One-to-Many relationship with Comment entity
   * One post can have many comments
   * Eager loading enabled to automatically load comments
   */
  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  comments: Comment[];
}