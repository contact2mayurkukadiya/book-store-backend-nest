import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { BookModule } from './modules/book/book.module';
import { GenreModule } from './modules/genre/genre.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: Boolean(process.env.POSTGRES_SYNCHRONIZE),
      autoLoadEntities: true,
      keepConnectionAlive: true,
      logging: false
    }),
    SharedModule,
    AuthModule,
    UserModule,
    BookModule,
    GenreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
