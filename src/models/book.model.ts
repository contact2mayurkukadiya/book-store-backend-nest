import { ApiProperty, ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { Response } from "./common.model";
import { IsNumber, IsOptional, IsString, isNumber } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";
import { APP_CONST } from "src/constants";
import { Pagination_Options, Pagination_Options_Response } from "./db_operation.model";
import { Search_Query } from "./db_operation.model";

export class Book {
    @ApiProperty()
    id: string;
}

export class CreateBook {
    @IsString()
    @ApiProperty({ example: defaults.title })
    title: string

    @IsString()
    @ApiProperty({ example: defaults.publisher, nullable: true })
    publisher: string

    @IsString()
    @ApiProperty({ example: defaults.genre_id, nullable: true })
    genre_id: string

    @IsString()
    @ApiProperty({ example: defaults.language, nullable: false })
    language: string

    @IsNumber()
    @ApiProperty({ example: defaults.format, nullable: false, enum: [APP_CONST.AUDIO_BOOK, APP_CONST.PDF] })
    format: number

    @IsNumber()
    @ApiProperty({ example: defaults.pages, nullable: false })
    pages: number
}

export class UpdateBook {

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.title })
    title: string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.publisher, nullable: true })
    publisher: string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.genre_id, nullable: true })
    genre_id: string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.language, nullable: true })
    language: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.pages, nullable: true })
    pages: number
}


export class BookCreatedResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Create })
    message: string;

    @ApiProperty({ type: Book })
    data: any
}

export class BookUpdatedResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Update })
    message: string;

    @ApiProperty({ type: Book })
    data: any
}
export class BookDeleteResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Delete })
    message: string;

    @ApiProperty()
    data: any
}

export class BookListResponse extends IntersectionType(Response, Pagination_Options_Response) {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Get })
    message: string;

    @ApiProperty({ type: Array<Book> })
    data: any
}

export class BookQueryParams extends IntersectionType(Search_Query, Pagination_Options) {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.genre_id })
    genre_id: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.owner_id })
    owner_id: string;
}