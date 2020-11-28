import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('counts')
class Count {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column()
    state: number;

    @Column('float')
    value;

    @Column('date')
    maturity: Date;

    @Column('float')
    addition;

    @Column('float')
    discount;

    @Column('float')
    paid;

    @Column()
    portion: string;

    @Column('text')
    note: string;

    @Column('date')
    dateadd: Date;

    @Column()
    fixed: number;
}

export default Count;