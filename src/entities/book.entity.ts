import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { GenreEntity } from "./genre.entity";
import { APP_CONST } from "src/constants";


@Entity('book')
export class BookEntity {

    @PrimaryGeneratedColumn('uuid')
    id: Number;

    @Column({ collation: "default", nullable: false })
    title: string;

    @Column({ nullable: true })
    owner_id: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: "owner_id" })
    owner: UserEntity;

    @Column({ collation: "default", nullable: false })
    publisher: string;

    @Column()
    genre_id: string;

    @ManyToOne(() => GenreEntity, (genre) => genre.id)
    @JoinColumn({ name: "genre_id" })
    genre: GenreEntity;

    @Column({ collation: "default", nullable: false })
    language: string;

    @Column({ type: "int", default: APP_CONST.PDF, enum: [APP_CONST.PDF, APP_CONST.AUDIO_BOOK], nullable: false })
    format: number;

    @Column({ type: "int", nullable: false })
    pages: number

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;
}
