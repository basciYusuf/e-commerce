import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1748701606802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users tablosunu oluştur
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Products tablosunu oluştur
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "price" DECIMAL(10,2) NOT NULL,
                "stock" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Tabloları sil (sıralama önemli - foreign key bağımlılıklarına dikkat et)
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
