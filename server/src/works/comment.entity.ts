import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Asset} from "../upload/asset.entity";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column()
    comment: string;

    @Column({ type: "json"})
    clip: JSON

    @CreateDateColumn()
    readonly createdAt?: Date;

    @Column()
    assetId?: number;

    @ManyToOne(type => Asset, asset => asset.comments)
    @JoinColumn({name: "assetId"})
    asset?: Asset;

}
