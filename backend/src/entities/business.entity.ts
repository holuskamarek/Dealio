import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Promotion } from './promotion.entity';
import { Follow } from './follow.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  address!: string;

  @Column({
    type: 'enum',
    enum: ['kavárna', 'bistro', 'restaurace', 'bar', 'cukrárna', 'jiné'],
  })
  type!: 'kavárna' | 'bistro' | 'restaurace' | 'bar' | 'cukrárna' | 'jiné';

  @Column({ type: 'uuid', name: 'owner_id' })
  owner_id!: string;

  @Column({ type: 'json', nullable: true })
  opening_hours!: Record<string, { open: string; close: string }>;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.businesses)
  owner!: User;

  @OneToMany(() => Promotion, (promotion) => promotion.business)
  promotions!: Promotion[];

  @OneToMany(() => Follow, (follow) => follow.business)
  followers!: Follow[];

  // TODO: Přidat geolokaci (latitude, longitude)
  // TODO: Přidat fotografie
  // TODO: Přidat rating/recenze
}

