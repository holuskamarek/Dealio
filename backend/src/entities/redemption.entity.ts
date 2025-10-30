import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Promotion } from './promotion.entity';
import { User } from './user.entity';

@Entity('redemptions')
export class Redemption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  promotion_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  pin_code!: string;

  @Column({ type: 'timestamp', nullable: true })
  used_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_used!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Promotion, (promotion) => promotion.redemptions)
  promotion!: Promotion;

  @ManyToOne(() => User, (user) => user.redemptions)
  user!: User;

  // TODO: Přidat expiraci PIN kódu
  // TODO: Přidat počet pokusů o uplatnění
  // FIXME: PIN kód by měl být generován automaticky
}

