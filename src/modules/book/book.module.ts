import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/entities/book.entity';
import { SharedModule } from 'src/shared/shared.module';
import { GenreEntity } from 'src/entities/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, GenreEntity]),
    SharedModule
  ],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule { }
