import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/entities/book.entity';
import { Book, CreateBook, UpdateBook } from 'src/models/book.model';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private Book: Repository<BookEntity>,
    ) { }

    FindBookByTitle(title: string): Promise<Book> {
        const doc: any = this.Book.findOne({ where: { title: title } })
        return doc;
    }

    async CreateBook(body): Promise<Book> {
        const doc: any = this.Book.create(body)
        await this.Book.save(doc);
        return doc;
    }

    async UpdateBook(id, body: UpdateBook): Promise<Book> {
        const doc: any = this.Book.create(body)
        await this.Book.update({ id }, doc);
        return doc;
    }
}
