import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';

/**
 * Follow entita reprezentuje vztah sledování mezi uživatelem a podnikem
 * Umožňuje uživatelům sledovat oblíbené podniky a dostávat notifikace o nových akcích
 * 
 * TODO: Přidat notifikační preference (email, push)
 * FIXME: Přidat unique constraint na kombinaci user_id + business_id
 */
@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id!: string;

  @Column({ type: 'uuid', name: 'business_id' })
  business_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business!: Business;
}

