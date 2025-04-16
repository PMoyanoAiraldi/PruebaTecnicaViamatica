import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from 'src/rol/rol.entity';

@Entity('menu_items')
export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column()
    path: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Rol, (rol) => rol.menuItems)
    @JoinColumn({ name: 'rolId' })
    rol: Rol;
}