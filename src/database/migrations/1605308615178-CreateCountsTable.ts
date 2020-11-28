import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCountsTable1605308615178 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "counts",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: "description",
                    type: "varchar"
                },
                {
                    name: "state",
                    type: "int",
                    default: 1
                },
                {
                    name: "value",
                    type: "float(15,3)",
                    default: 0
                },
                {
                    name: "maturity",
                    type: "date"
                },
                {
                    name: "addition",
                    type: "float(15,3)",
                    default: 0
                },
                {
                    name: "discount",
                    type: "float(15,3)",
                    default: 0
                },
                {
                    name: "paid",
                    type: "float(15,3)",
                    default: 0
                },
                {
                    name: "portion",
                    type: "varchar",
                    default: 1
                },
                {
                    name: "note",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "dateadd",
                    type: "timestamp",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: "fixed",
                    type: "int",
                    default: 0
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('counts');
    }
}
