import { Body, Controller, HttpStatus, Param, Post, Put, Request, Response, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { QueryService } from 'src/shared/services/query.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { Book, BookCreatedResponse, BookUpdatedResponse, CreateBook, UpdateBook } from 'src/models/book.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { RolesGuard } from 'src/shared/gaurds/author.guard';

export const Roles = (...roles: number[]) => SetMetadata('roles', roles);


@Controller('book')
@UsePipes(new ValidationPipe({ transform: true }))
export class BookController {
    constructor(private bookService: BookService, private utils: UtilsService, private queryService: QueryService) { }

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

            const inputFields = ['title', 'publisher', 'owner_id', 'genre_id', 'language', 'format', 'pages'];
            const inputObj: CreateBook = this.utils.constructObject(body, inputFields) as CreateBook;
            const inserted = await this.bookService.CreateBook(inputObj);
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
            const inserted = await this.bookService.UpdateBook(param, inputObj);
            logger.log(level.info, `New Book Updated : ${this.utils.beautify(inserted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Book Updated Successfully",
                data: inserted
            });

        } catch (error) {
            logger.log(level.error, `updateBook Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
