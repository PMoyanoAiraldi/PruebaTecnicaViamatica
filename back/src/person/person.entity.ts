import { User } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('person')
export class Person {
    @PrimaryGeneratedColumn()
    idPerson: number;

    @Column({ length: 60 })
    names: string;

    @Column({ length: 60 })
    surnames: string;

    @Column({ length: 10, unique: true })
    identification: string;

    @Column({ type: 'date' })
    dateBirth: Date;

    @OneToMany(() => User, (user) => user.person)
    users: User[];

    @Column({ default: true })
    state: boolean;
}
