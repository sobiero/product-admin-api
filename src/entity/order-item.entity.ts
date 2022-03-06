import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ schema: 'node_admin' })
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_title: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    price;

    @Column()
    quantity: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}
