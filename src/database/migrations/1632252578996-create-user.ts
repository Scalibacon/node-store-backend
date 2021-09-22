import {MigrationInterface, QueryRunner, Table } from "typeorm";
import md5 from 'md5';
import Admin from "../../models/Admin";

export class createUser1632252578996 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "cpf",
                    type: "varchar",
                    length: "11",
                    isUnique: true,
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                },
            ]
        }));

        await queryRunner.createTable(new Table({
            name: "admin",
            columns: [
                {
                    name: "id",
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "password",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "cpf",
                    type: "varchar",
                    length: "11",
                    isUnique: true,
                    isNullable: true
                },                
                {
                    name: "role",
                    type: "integer",
                    isNullable: false,
                    default: 1
                },
                {
                    name: "is_active",
                    type: "boolean",
                    isNullable: false,
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                },
            ]
        }));

        await queryRunner.manager.save(
            queryRunner.manager.create<Admin>(Admin, {
                name: process.env.DEFAULT_USER_NAME,
                email: process.env.DEFAULT_USER_EMAIL,
                password: md5(process.env.DEFAULT_USER_PASSWORD || "senha"),
                role: 7,
                isActive: true
            })
        );    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("admin");
        await queryRunner.dropTable("user");
    };
}
