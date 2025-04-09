import { Rol } from "src/rol/rol.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol_options')
export class RolOptions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nameOption: string;

    @ManyToOne(() => Rol, (rol) => rol.optionsRol)
    rol: Rol;

    @Column({default: true})
    state: boolean
}