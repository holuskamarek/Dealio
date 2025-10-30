import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Business } from './business.entity';
import { Event } from './event.entity';
import { Redemption } from './redemption.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ['user', 'business_owner', 'admin'],
    default: 'user',
  })
  role: 'user' | 'business_owner' | 'admin';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Business, (business) => business.owner)
  businesses: Business[];

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => Redemption, (redemption) => redemption.user)
  redemptions: Redemption[];

  // TODO: Přidat pole pro notifikace (email_verified, phone, atd.)
  // TODO: Přidat pole pro loajální body
}

