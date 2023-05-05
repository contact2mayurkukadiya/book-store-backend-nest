import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, serialize } from 'class-transformer';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/models/user.model';
import { QueryService } from 'src/shared/services/query.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private User: Repository<UserEntity>,
        private queryService: QueryService
    ) {

    }

    async CreateUser(inputData): Promise<User> {
        try {
            const user: any = this.User.create(inputData)
            await this.User.save(user);
            return user
        } catch (error) {
            throw error
        }
    }

    FindUserByRoleIdAndCreatedId = async (filter) => {
        var query = this.User.createQueryBuilder()
            .select("id, firstname, lastname, email, phone, address,postcode, city, state, country, emailverified, canlogin,  role, created_at, updated_at")
            .where('role = :role', { role: filter['role'] })

        const searchFields = {
            'firstname': "text",
            'lastname': "text",
            'email': "text",
            'phone': "text",
            'address': "text",
            'city': "text",
            'state': "text",
            'country': "text",
        }

        query = this.queryService.ApplySearchToQuery(query, filter, Object.entries(searchFields));

        const count = await query.getCount();
        const result = { count };

        query = this.queryService.ApplyPaginationToQuery(query, filter);

        if ('offset' in filter && filter.offset) {
            result['offset'] = filter['offset'];
        }
        if ('limit' in filter && filter.limit) {
            result['limit'] = filter.limit;
        }

        const data = await query.execute();
        result['data'] = data;

        return result;
    }

    FindUserById(id) {
        return this.User.findOne({ where: { id } });
    }

    DeleteUserQuery(id) {
        /* return this.Admin.createQueryBuilder()
            .delete()
            .from('admin')
            .where('id = :id', { id }) */
        return this.User.delete({ id });
    }

    UpdateUserQuery(id, body) {
        const admin: any = this.User.create(body);
        return this.User.update({ id }, admin);
    }

}
