import { Rol } from "src/rol/rol.entity";
import { User } from "src/users/users.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol_users')
export class RolUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.rolesUsers)
    user: User;

    @ManyToOne(() => Rol, (rol) => rol.usersWithRol)
    rol: Rol;
}