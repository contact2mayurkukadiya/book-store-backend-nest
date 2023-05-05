import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from "class-validator"
import { defaults } from "src/constants/documentation_default_values.const";
import { Response } from "./common.model";
import { APP_CONST } from "src/constants";

export class Login {
    @IsEmail()
    @ApiProperty({ example: defaults.email })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: defaults.password })
    password: string;
}


export class CreateUser extends Login {

    @IsString()
    @ApiProperty({ example: defaults.firstName })
    firstname: string;

    @IsString()
    @ApiProperty({ example: defaults.lastname })
    lastname: string;

    @IsString()
    @ApiProperty({ example: defaults.email })
    email: string;

    @IsString()
    @ApiProperty({ example: defaults.password })
    password: string;
}

export class User extends CreateUser {

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.userId })
    id: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.email })
    email: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.password })
    password: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.firstName })
    firstname: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.lastname })
    lastname: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.phone })
    phone: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.address })
    address: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.postcode })
    postcode: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.city })
    city: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.country })
    country: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.state })
    state: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.emailverified })
    emailverified: boolean;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.role })
    role: number;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdAt })
    created_at: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.updatedAt })
    updated_at: string

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.emptyData })
    access_token: string
}


export class UpdateUser {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.firstName })
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.lastname })
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.phone })
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.address })
    address: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.postcode })
    postcode: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.city })
    city: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.country })
    country: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.state })
    state: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.password })
    old_password: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.password })
    password: string;
}

export class UpdateUserStatus {

    @IsNumber()
    @IsIn([true, false])
    @ApiProperty({ example: defaults.userStatus })
    canlogin: number;
}

export class UpdateUserRole {

    @IsNumber()
    @IsIn([APP_CONST.NORMAL_USER_ROLE, APP_CONST.AUTHOR_USER_ROLE])
    @ApiProperty({ example: defaults.role })
    role: number;
}

export class LoginResponse extends Response {
    @ApiProperty({ type: User })
    data: any
}

export class UserCreatedResponse extends Response {
    @ApiProperty({ type: OmitType(User, ["access_token", 'password']) })
    data: any
}

export class UserUpdatedResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Update })
    message: string

    @ApiProperty({ type: OmitType(User, ["access_token", 'password']) })
    data: any
}

export class UserDeletedResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Delete })
    message: string
}