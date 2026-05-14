import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export type TUserRole =
  | 'PROF-CLI-001'
  | 'PROF-TIE-002'
  | 'PROF-SUP-003'
  | 'PROF-OPE-004'
  | 'PROF-INS-005'
  | 'PROF-TRP-006'
  | 'PROF-AGA-007'
  | 'PROF-AUD-008';

@Entity('res_users') // Odoo naming convention
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  @Exclude() // Don't return password in JSON
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PROF-CLI-001', // Default to client
  })
  role: TUserRole;

  @Column({ nullable: true })
  storeId: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'create_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'write_date' })
  updatedAt: Date;
}
