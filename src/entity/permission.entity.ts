import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'node_admin' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
