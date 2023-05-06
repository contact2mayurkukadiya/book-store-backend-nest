import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Response, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GenreService } from './genre.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/shared/gaurds/author.guard';
import { CreateGenre, Genre, GenreCreatedResponse, GenreDeleteResponse, GenreListResponse, GenreUpdatedResponse, UpdateGenre } from 'src/models/genre.model';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { level, logger } from 'src/config';

@Controller('genre')
@UsePipes(new ValidationPipe({ transform: true }))
export class GenreController {
    constructor(private genreService: GenreService, private utils: UtilsService) { }


    @ApiTags('Genre')
    @ApiResponse({ type: GenreListResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Get('getAllGenre')
    async getAllGenre(@Request() req, @Response() res) {
        try {
            logger.log(level.info, `getAllGenre`);
            const genreList: Genre[] = await this.genreService.GetAllGenre();
            logger.log(level.info, `genreList: ${this.utils.beautify(genreList)}`);

            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Genre Created Successfully",
                data: genreList
            });

        } catch (error) {
            logger.log(level.error, `createGenre Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Genre')
    @ApiBody({ type: CreateGenre })
    @ApiResponse({ type: GenreCreatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(APP_CONST.AUTHOR_USER_ROLE)
    @Post('createGenre')
    async createGenre(@Body() body: CreateGenre, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createGenre body=${this.utils.beautify(body)}`);
            const currentGenre: Genre = await this.genreService.FindGenreByName(body.genre);
            logger.log(level.info, `currentGenre: ${this.utils.beautify(currentGenre)}`);

            if (currentGenre) {
                return this.utils.sendJSONResponse(res, HttpStatus.CONFLICT, {
                    success: false,
                    message: ERROR_CONST.ALREADY_EXIST.replace("{{value}}", 'Genre'),
                    data: null
                });
            }

            const inputFields = ['genre'];
            const inputObj: CreateGenre = this.utils.constructObject(body, inputFields) as CreateGenre;
            const inserted = await this.genreService.CreateGenre(inputObj);
            logger.log(level.info, `New Genre Created : ${this.utils.beautify(inserted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Genre Created Successfully",
                data: inserted
            });

        } catch (error) {
            logger.log(level.error, `createGenre Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }


    @ApiTags('Genre')
    @ApiBody({ type: UpdateGenre })
    @ApiResponse({ type: GenreUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(APP_CONST.AUTHOR_USER_ROLE)
    @Put('updateGenre/:id')
    async updateGenre(@Param('id') param, @Body() body: UpdateGenre, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateGenre body=${this.utils.beautify(body)} param=${param}`);
            const currentGenre: Genre = await this.genreService.FindGenreByName(body.genre);
            logger.log(level.info, `currentGenre: ${this.utils.beautify(currentGenre)}`);

            if (currentGenre && currentGenre.id != param) {
                return this.utils.sendJSONResponse(res, HttpStatus.CONFLICT, {
                    success: false,
                    message: ERROR_CONST.ALREADY_EXIST.replace("{{value}}", 'Genre'),
                    data: null
                });
            }

            const inputFields = ['genre'];
            const inputObj: UpdateGenre = this.utils.constructObject(body, inputFields) as UpdateGenre;
            await this.genreService.UpdateGenre(param, inputObj);
            const updated = await this.genreService.getGenreById(param);
            logger.log(level.info, `New Genre Updated : ${this.utils.beautify(updated)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Genre Updated Successfully",
                data: updated
            });

        } catch (error) {
            logger.log(level.error, `updateGenre Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Genre')
    @ApiResponse({ type: GenreDeleteResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(APP_CONST.AUTHOR_USER_ROLE)
    @Delete('deleteGenre/:id')
    async deleteGenre(@Param('id') param, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deleteGenre param=${param}`);
            const deleted = await this.genreService.DeleteGenre(param);
            logger.log(level.info, `Delted Genre : ${this.utils.beautify(deleted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Genre Deleted Successfully",
                data: deleted
            });

        } catch (error) {
            logger.log(level.error, `deleteGenre Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }
}
