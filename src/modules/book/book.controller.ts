import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Request, Response, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { QueryService } from 'src/shared/services/query.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { Book, BookCreatedResponse, BookDeleteResponse, BookListResponse, BookQueryParams, BookUpdatedResponse, CreateBook, UpdateBook } from 'src/models/book.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/shared/gaurds/author.guard';

@Controller('book')
@UsePipes(new ValidationPipe({ transform: true }))
export class BookController {
    constructor(private bookService: BookService, private utils: UtilsService, private queryService: QueryService) { }

    @ApiTags('Book')
    @ApiQuery({ type: BookQueryParams })
    @ApiResponse({ type: BookListResponse })
    // @ApiBearerAuth("access_token")
    // @UseGuards(JwtAuthGuard)
    @Get('getAllBook')
    async getAllBook(@Query() query: BookQueryParams, @Request() req, @Response() res) {
        try {
            const filter = {
                "offset": query['offset'],
                "limit": query['limit'],
                "order": query['order'],
            }
            'owner_id' in query ? filter['owner_id'] = query['owner_id'] : null;
            'genre_id' in query ? filter['genre_id'] = query['genre_id'] : null;
            'search_query' in query ? filter['search_query'] = query['search_query'] : null;

            logger.log(level.info, `getAllBook Query: ${this.utils.beautify(query)}`);
            const books = await this.bookService.FindBook(query);
            logger.log(level.info, `getAllBook: ${this.utils.beautify(books)}`);

            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Book Fetched Successfully",
                data: books
            });

        } catch (error) {
            logger.log(level.error, `createUser Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Book')
    @ApiBody({ type: CreateBook })
    @ApiResponse({ type: BookCreatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(APP_CONST.AUTHOR_USER_ROLE)
    @Post('createBook')
    async createBook(@Body() body: CreateBook, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createBook body=${this.utils.beautify(body)}`);
            const currentBook: Book = await this.bookService.FindBookByTitle(body.title);
            logger.log(level.info, `currentBook: ${this.utils.beautify(currentBook)}`);

            if (currentBook) {
                return this.utils.sendJSONResponse(res, HttpStatus.CONFLICT, {
                    success: false,
                    message: ERROR_CONST.BOOK_ALREADY_EXIST,
                    data: null
                });
            }

            const inputFields = ['title', 'publisher', 'genre_id', 'language', 'format', 'pages'];
            const inputObj: CreateBook = this.utils.constructObject(body, inputFields) as CreateBook;
            const inserted = await this.bookService.CreateBook({ ...inputObj, owner_id: req.user.id });
            logger.log(level.info, `New Book Created : ${this.utils.beautify(inserted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Book Created Successfully",
                data: inserted
            });

        } catch (error) {
            logger.log(level.error, `createUser Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Book')
    @ApiBody({ type: UpdateBook })
    @ApiResponse({ type: BookUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(APP_CONST.AUTHOR_USER_ROLE)
    @Put('updateBook/:id')
    async updateBook(@Param('id') param, @Body() body: UpdateBook, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateBook body=${this.utils.beautify(body)} param=${param}`);
            const currentBook: Book = await this.bookService.FindBookByTitle(body.title);
            logger.log(level.info, `currentBook: ${this.utils.beautify(currentBook)}`);

            if (currentBook && currentBook.id != param) {
                return this.utils.sendJSONResponse(res, HttpStatus.CONFLICT, {
                    success: false,
                    message: ERROR_CONST.BOOK_ALREADY_EXIST,
                    data: null
                });
            }

            const inputFields = ['title', 'publisher', 'genre_id', 'language', 'pages'];
            const inputObj: UpdateBook = this.utils.constructObject(body, inputFields) as UpdateBook;
            await this.bookService.UpdateBook(param, req.user.id, inputObj);
            const updated = await this.bookService.GetBookById(param, req.user.id);
            logger.log(level.info, `New Book Updated : ${this.utils.beautify(updated)}`);
            if (updated) {
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    message: "Book Updated Successfully",
                    data: updated
                });
            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    message: ERROR_CONST.BAD_REQUEST,
                    data: null
                });
            }
        } catch (error) {
            logger.log(level.error, `updateBook Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Book')
    @ApiResponse({ type: BookDeleteResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(APP_CONST.AUTHOR_USER_ROLE)
    @Delete('deleteBook/:id')
    async deleteBook(@Param('id') param, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deleteBook param=${param}`);
            const deleted = await this.bookService.DeleteBook(param, req.user.id);
            logger.log(level.info, `Delted Genre : ${this.utils.beautify(deleted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Book Deleted Successfully",
                data: deleted
            });
        } catch (error) {
            logger.log(level.error, `deleteBook Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
