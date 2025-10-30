import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Promotion } from './promotion.entity';
import { User } from './user.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  promotion_id!: string;

  @Column({ type: 'uuid', nullable: true })
  user_id!: string | null;

  @Column({
    type: 'enum',
    enum: ['view', 'click', 'redeem', 'follow', 'unfollow'],
  })
  type!: 'view' | 'click' | 'redeem' | 'follow' | 'unfollow';

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn()
  timestamp!: Date;

  // Relations
  @ManyToOne(() => Promotion, (promotion) => promotion.events)
  promotion!: Promotion;

  @ManyToOne(() => User, (user) => user.events, { nullable: true })
  user!: User;

  // TODO: Přidat IP adresu pro anonymní tracking
  // TODO: Přidat user agent pro device tracking
}

