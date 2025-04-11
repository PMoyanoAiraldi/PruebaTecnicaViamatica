import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('sessions')
export class Sessions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    entryDate: Date;

    @Column({ type: 'date', nullable: true })
    closingDate: Date;

    @ManyToOne(() => User, (users) => users.sessions)
    users: User;
}