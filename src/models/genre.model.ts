import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Response } from "./common.model";
import { IsNumber, IsOptional, IsString, isNumber } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";
import { APP_CONST } from "src/constants";

export class Genre {
    @ApiProperty({ example: defaults.genre_id })
    id: string;

    @ApiProperty({ example: defaults.genre })
    genre: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;

}

export class CreateGenre {
    @IsString()
    @ApiProperty({ example: defaults.genre, nullable: false })
    genre: string
}

export class UpdateGenre {

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.genre, nullable: false })
    genre: string
}


export class GenreListResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Get })
    message: string;

    @ApiProperty({ type: Array<Genre> })
    data: any
}

export class GenreCreatedResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Create })
    message: string;

    @ApiProperty({ type: Genre })
    data: any
}

export class GenreUpdatedResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Update })
    message: string;

    @ApiProperty({ type: Genre })
    data: any
}

export class GenreDeleteResponse extends Response {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Delete })
    message: string;

    data: any;
}