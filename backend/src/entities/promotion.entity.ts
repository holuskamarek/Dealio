import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Business } from './business.entity';
import { Event } from './event.entity';
import { Redemption } from './redemption.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  business_id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'integer', default: 0 })
  discount_percent!: number;

  @Column({ type: 'timestamp' })
  start_datetime!: Date;

  @Column({ type: 'timestamp' })
  end_datetime!: Date;

  @Column({ type: 'simple-array', nullable: true })
  target_hours!: string[];

  @Column({ type: 'integer', nullable: true })
  limit!: number;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Business, (business) => business.promotions)
  business!: Business;

  @OneToMany(() => Event, (event) => event.promotion)
  events!: Event[];

  @OneToMany(() => Redemption, (redemption) => redemption.promotion)
  redemptions!: Redemption[];

  // TODO: Přidat fotografie/obrázky
  // TODO: Přidat kategorie akcí
  // FIXME: target_hours by měly být lépe strukturované (JSON místo simple-array)
}

