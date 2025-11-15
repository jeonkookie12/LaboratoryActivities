import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../entities/user.entity'; 

/**
 * Posts service
 * Contains all business logic for blog post management operations
 * Ensures users can only modify their own posts
 */
@Injectable()
export class PostsService {
  constructor(
    // Inject the TypeORM repository for Post entity
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Retrieves all posts with their authors and comments
   * Posts are ordered by creation date (newest first)
   * Comments are included with their authors
   * @returns {Promise<Post[]>} Array of all posts
   */
  async findAll(): Promise<Post[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.color',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'comment.id',
        'comment.body',
        'comment.createdAt',
        'commentAuthor.id',
        'commentAuthor.username',
      ])
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Retrieves a single post by its ID with author and comments
   * Comments are ordered by creation date (oldest first)
   * @param {string} id - The post ID
   * @returns {Promise<Post>} The post with the specified ID
   * @throws {NotFoundException} If the post is not found
   */
  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.color',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'comment.id',
        'comment.body',
        'comment.createdAt',
        'commentAuthor.id',
        'commentAuthor.username',
      ])
      .where('post.id = :id', { id })
      .orderBy('comment.createdAt', 'ASC')
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * Creates a new blog post
   * Assigns a random color from a predefined palette
   * Sets creation and update timestamps
   * @param {CreatePostDto} createPostDto - Post data to create
   * @param {User} user - The user creating the post
   * @returns {Promise<Post>} The newly created post
   */
  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    // Predefined color palette for posts
    const colors = [
      '#fce4ec', '#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5',
      '#f9fbe7', '#e0f7fa', '#fffde7', '#ede7f6', '#f1f8e9',
    ];
    const post = this.postsRepository.create({
      ...createPostDto,
      color: colors[Math.floor(Math.random() * colors.length)], // Random color from palette
      author: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedPost = await this.postsRepository.save(post);
    return this.findOne(savedPost.id); // Return post with relations loaded
  }

  /**
   * Updates an existing post (only if user is the author)
   * @param {string} id - The post ID to update
   * @param {UpdatePostDto} updatePostDto - Partial post data to update
   * @param {User} user - The user attempting to update
   * @returns {Promise<Post>} The updated post
   * @throws {NotFoundException} If the post is not found or user is not the author
   */
  async update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOne(id);

    // Verify that the user is the author of the post
    if (String(post.author.id) !== String(user.id)) {
      console.log('Mismatch:', post.author.id, user.id);
      throw new NotFoundException('You can only edit your own posts');
    }

    Object.assign(post, updatePostDto);
    post.updatedAt = new Date();
    await this.postsRepository.save(post);
    return this.findOne(id);
  }

  /**
   * Deletes a post (only if user is the author)
   * @param {string} id - The post ID to delete
   * @param {User} user - The user attempting to delete
   * @returns {Promise<void>} Promise that resolves when the post is deleted
   * @throws {NotFoundException} If the post is not found or user is not the author
   */
  async remove(id: string, user: User): Promise<void> {
    const post = await this.findOne(id);
    // Verify that the user is the author of the post
    if (String(post.author.id) !== String(user.id)) {
      throw new NotFoundException('You can only delete your own posts');
    }
    await this.postsRepository.remove(post);
  }
}