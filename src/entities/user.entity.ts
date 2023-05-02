import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { APP_CONST } from "src/constants";


@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: Number;

    @Column({ collation: "default" })
    firstname: string;

    @Column({ collation: "default" })
    lastname: string;

    @Column({ collation: "default", nullable: false })
    email: string;

    @Column({ collation: "default", nullable: false })
    password: string;

    @Column({ collation: "default", nullable: true })
    phone: string;

    @Column({ collation: "default", nullable: true })
    address: string;

    @Column({ collation: "default", nullable: true })
    postcode: string;

    @Column({ collation: "default", nullable: true })
    city: string;

    @Column({ collation: "default" })
    country: string;

    @Column({ default: true })
    emailverified: Boolean;

    @Column({ default: true })
    canlogin: Boolean;

    @Column({ type: "int", default: 1, enum: [APP_CONST.NORMAL_USER_ROLE, APP_CONST.AUTHOR_USER_ROLE] })
    role: Number;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    @BeforeUpdate()
    async updatePassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 8);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
