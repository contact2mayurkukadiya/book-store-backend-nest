import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from 'src/entities/genre.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreEntity]),
    SharedModule
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule { }
