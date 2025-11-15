import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';

/**
 * Comments service
 * Contains all business logic for comment management operations
 * Ensures users can only modify their own comments
 */
@Injectable()
export class CommentsService {
  constructor(
    // Inject the TypeORM repository for Comment entity
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    // Inject the TypeORM repository for Post entity
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Creates a new comment on a specific post
   * Sets creation and update timestamps automatically
   * @param {string} postId - The ID of the post to comment on
   * @param {CreateCommentDto} createCommentDto - Comment data to create
   * @param {User} user - The user creating the comment
   * @returns {Promise<Comment>} The newly created comment with author relation
   * @throws {NotFoundException} If the post is not found
   */
  async create(postId: string, createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post,
      author: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedComment = await this.commentsRepository.save(comment);

    // Return comment with author relation loaded
    return this.commentsRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author'],
    });
  }

  /**
   * Updates an existing comment (only if user is the author)
   * @param {string} id - The comment ID to update
   * @param {UpdateCommentDto} updateCommentDto - Partial comment data to update
   * @param {User} user - The user attempting to update
   * @returns {Promise<Comment>} The updated comment
   * @throws {NotFoundException} If the comment is not found
   * @throws {ForbiddenException} If the user is not the author
   */
  async update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    // Verify that the user is the author of the comment
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    Object.assign(comment, updateCommentDto);
    comment.updatedAt = new Date();
    return this.commentsRepository.save(comment);
  }

  /**
   * Deletes a comment (only if user is the author)
   * @param {string} id - The comment ID to delete
   * @param {User} user - The user attempting to delete
   * @returns {Promise<{message: string}>} Success message
   * @throws {NotFoundException} If the comment is not found
   * @throws {ForbiddenException} If the user is not the author
   */
  async remove(id: string, user: User): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);
    // Verify that the user is the author of the comment
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}