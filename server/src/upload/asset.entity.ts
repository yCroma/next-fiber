import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {Comment} from "../works/comment.entity"

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column()
  comment: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column({ type: "json" })
  settings: JSON

  @OneToMany(() => Comment, comment => comment.asset)
  comments?: Comment[];
}
