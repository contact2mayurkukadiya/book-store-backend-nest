import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreEntity } from 'src/entities/genre.entity';
import { Genre, UpdateGenre } from 'src/models/genre.model';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(GenreEntity)
        private Genre: Repository<GenreEntity>,
    ) { }

    FindGenreByName(genre: string): Promise<Genre> {
        const doc: any = this.Genre.findOne({ where: { genre: ILike(`%${genre}%`) } })
        return doc;
    }

    getGenreById(id): Promise<Genre> {
        const doc: any = this.Genre.findOne({ where: { id } })
        return doc;
    }

    GetAllGenre(): Promise<Genre[]> {
        const doc: any = this.Genre.find();
        return doc;
    }

    async CreateGenre(body): Promise<Genre> {
        const doc: any = this.Genre.create(body)
        await this.Genre.save(doc);
        return doc;
    }

    async UpdateGenre(id, body: UpdateGenre): Promise<Genre> {
        const doc: any = this.Genre.create(body)
        const updated = await this.Genre.update({ id }, doc);
        console.log(updated);
        return doc;
    }

    async DeleteGenre(id) {
        return this.Genre.delete({ id })
    }
}
