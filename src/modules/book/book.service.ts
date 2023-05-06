import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/entities/book.entity';
import { Book, BookListResponse, CreateBook, UpdateBook } from 'src/models/book.model';
import { QueryService } from 'src/shared/services/query.service';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private Book: Repository<BookEntity>,
        private queryService: QueryService
    ) { }

    FindBookByTitle(title: string): Promise<Book> {
        const doc: any = this.Book.findOne({ where: { title: title } })
        return doc;
    }

    GetBookById(id, owner_id): Promise<Book> {
        const doc: any = this.Book.findOne({ where: { id, owner_id } })
        return doc;
    }

    async FindBook(filter): Promise<BookListResponse> {
        const searchFields = {
            'title': "text",
            'publisher': "text",
            'genre.genre': "text",
            'user.firstname': "text",
            'user.lastname': "text",
            'user.email': "text",
            'language': "text",
            'pages': "number"
        };

        var query = this.Book.createQueryBuilder('book')
            .leftJoinAndSelect('book.genre', 'genre')
            .leftJoin('book.owner', 'user')
            .addSelect(['user.id', 'user.firstname', 'user.lastname', 'user.email', 'user.role'])
        if ('owner_id' in filter) {
            query = query.where('user.id = :owner_id', { owner_id: filter['owner_id'] })
        }
        if ('genre_id' in filter) {
            query = query.andWhere('genre.id = :genre_id', { genre_id: filter['genre_id'] })
        }

        query = this.queryService.ApplySearchToQuery(query, filter, Object.entries(searchFields));

        const count = await query.getCount();
        const result: any = { count };

        query = this.queryService.ApplyPaginationToQuery(query, filter);

        if ('offset' in filter && filter.offset) {
            result['offset'] = parseInt(filter['offset']);
        }
        if ('limit' in filter && filter.limit) {
            result['limit'] = parseInt(filter.limit);
        }

        // query.printSql();
        const data = await query.getMany();
        result['data'] = data;

        return result;
    }

    async CreateBook(body): Promise<Book> {
        const doc: any = this.Book.create(body)
        await this.Book.save(doc);
        return doc;
    }

    async UpdateBook(id, owner_id, body: UpdateBook): Promise<Book> {
        const doc: any = this.Book.create(body)
        await this.Book.update({ id, owner_id }, doc);
        return doc;
    }

    async DeleteBook(id, owner_id) {
        return this.Book.delete({ id, owner_id })
    }
}
