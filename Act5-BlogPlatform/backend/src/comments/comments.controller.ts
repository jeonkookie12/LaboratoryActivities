import { Controller, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

/**
 * Comments controller
 * Handles all HTTP requests related to comment management
 * All endpoints require JWT authentication
 * All endpoints are prefixed with '/comments'
 */
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  /**
   * POST /comments/:postId
   * Creates a new comment on a specific post
   * Requires JWT authentication
   * @param {string} postId - The post ID from the URL parameter
   * @param {CreateCommentDto} createCommentDto - Comment data from the request body
   * @param {User} user - Authenticated user from JWT token
   * @returns {Promise<Comment>} The newly created comment
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Post(':postId')
  create(@Param('postId') postId: string, @Body() createCommentDto: CreateCommentDto, @GetUser() user) {
    return this.commentsService.create(postId, createCommentDto, user);
  }

  /**
   * PUT /comments/:id
   * Updates an existing comment (only if user is the author)
   * Requires JWT authentication
   * @param {string} id - The comment ID from the URL parameter
   * @param {UpdateCommentDto} updateCommentDto - Partial comment data to update
   * @param {User} user - Authenticated user from JWT token
   * @returns {Promise<Comment>} The updated comment
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @GetUser() user) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  /**
   * DELETE /comments/:id
   * Deletes a comment (only if user is the author)
   * Requires JWT authentication
   * @param {string} id - The comment ID from the URL parameter
   * @param {User} user - Authenticated user from JWT token
   * @returns {Promise<{message: string}>} Success message
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    return this.commentsService.remove(id, user);
  }
}