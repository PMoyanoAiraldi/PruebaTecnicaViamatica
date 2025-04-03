import { Person } from "src/person/person.entity";
import { RolUsers } from "src/rol_users/rol_users.entity";
import { Sessions } from "src/sessions/sessions.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    idUser: number;

    @Column({ length: 20,type: 'varchar' })
    username: string;

    @Column({ length: 20 })
    password: string;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({ length: 20, default: 'USER'})
    status: string;


    @Column({ type: 'int', default: 0 })
    failedAttempts: number;

    @ManyToOne(() => Person, (person) => person.users)
    person: Person;

    @OneToMany(() => RolUsers, (rolUsers) => rolUsers.user)
    rolesUsers: RolUsers[];

    @OneToMany(() => Sessions, (sessions) => sessions.users)
    sessions: Sessions[];

    
}