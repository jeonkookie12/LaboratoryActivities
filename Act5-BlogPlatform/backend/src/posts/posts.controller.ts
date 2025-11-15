import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';

/**
 * Posts controller
 * Handles all HTTP requests related to blog post management
 * All endpoints are prefixed with '/posts'
 */
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  /**
   * GET /posts
   * Retrieves all posts with their authors and comments
   * Public endpoint - no authentication required
   * @returns {Promise<Post[]>} Array of all posts
   */
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  /**
   * GET /posts/:id
   * Retrieves a single post by its ID with author and comments
   * Public endpoint - no authentication required
   * @param {string} id - The post ID from the URL parameter
   * @returns {Promise<Post>} The post with the specified ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  /**
   * POST /posts
   * Creates a new blog post
   * Requires JWT authentication
   * @param {CreatePostDto} createPostDto - Post data from the request body
   * @param {User} user - Authenticated user from JWT token
   * @returns {Promise<Post>} The newly created post
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  /**
   * PUT /posts/:id
   * Updates an existing post (only if user is the author)
   * Requires JWT authentication
   * @param {string} id - The post ID from the URL parameter
   * @param {UpdatePostDto} updatePostDto - Partial post data to update
   * @param {User} user - Authenticated user from JWT token
   * @returns {Promise<Post>} The updated post
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @GetUser() user: User) {
    return this.postsService.update(id, updatePostDto, user);
  }

  /**
   * DELETE /posts/:id
   * Deletes a post (only if user is the author)
   * Requires JWT authentication
   * @param {string} id - The post ID from the URL parameter
   * @param {User} user - Authenticated user from JWT token
   * @returns {Promise<void>} Promise that resolves when the post is deleted
   */
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.remove(id, user);
  }
}
