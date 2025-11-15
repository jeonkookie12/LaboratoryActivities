import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

/**
 * Comment entity
 * Represents a comment on a blog post in the database
 * Maps to the 'comments' table in MySQL
 * Each comment belongs to a post and a user (author)
 */
@Entity('comments')
export class Comment {
  /**
   * Primary key - auto-generated UUID for each comment
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Comment body/content
   * Maximum length: 250 characters
   */
  @Column({ length: 250 })
  body: string;

  /**
   * Timestamp when the comment was created
   * Maps to 'created_at' column in the database
   */
  @Column({ name: 'created_at' })
  createdAt: Date;

  /**
   * Timestamp when the comment was last updated
   * Maps to 'updated_at' column in the database
   */
  @Column({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Many-to-One relationship with Post entity
   * Many comments can belong to one post
   */
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  /**
   * Many-to-One relationship with User entity
   * Many comments can belong to one user (author)
   * Eager loading enabled to automatically load author
   */
  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: 'author_id' }) 
  author: User;
}