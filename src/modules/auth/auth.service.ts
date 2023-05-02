import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CONST, JWT_CONST } from 'src/constants';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private User: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async validateEmailAndPassword(email, password) {
        const user = await this.User.findOne({
            where: { email, canlogin: true }
        })
        if (!(await user?.validatePassword(password))) {
            throw new UnauthorizedException({
                success: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                message: ERROR_CONST.USER_NOT_AUTHORIZED,
                data: {}
            })
        } else {
            return user;
        }
    }

    login(user: User): User {
        const response = { ...user }
        delete response.password;
        response['access_token'] = this.jwtService.sign(response)
        return response;
    }
}
