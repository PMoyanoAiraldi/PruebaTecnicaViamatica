import { RolOptions } from "src/rol_options/rol_options.entity";
import { RolUsers } from "src/rol_users/rol_users.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol')
export class Rol {
    @PrimaryGeneratedColumn()
    idRol: number;

    @Column({ length: 20, unique: true })
    rolName: string;

    @OneToMany(() => RolUsers, (rolUsuarios) => rolUsuarios.rol)
    usersWithRol: RolUsers[];

    @OneToMany(() => RolOptions, (rolOptions) => rolOptions.rol)
    optionsRol: RolOptions[];
}