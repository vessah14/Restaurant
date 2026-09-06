using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    [Migration("20260906210000_AddCloudinaryPublicIds")]
    public partial class AddCloudinaryPublicIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                SET @sql = IF(
                    EXISTS (
                        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = DATABASE()
                          AND TABLE_NAME = 'Plats'
                          AND COLUMN_NAME = 'ImagePublicId'
                    ),
                    'SELECT 1',
                    'ALTER TABLE `Plats` ADD COLUMN `ImagePublicId` varchar(255) NULL'
                );
                PREPARE add_plats_image_public_id FROM @sql;
                EXECUTE add_plats_image_public_id;
                DEALLOCATE PREPARE add_plats_image_public_id;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    EXISTS (
                        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = DATABASE()
                          AND TABLE_NAME = 'Galeries'
                          AND COLUMN_NAME = 'ImagePublicId'
                    ),
                    'SELECT 1',
                    'ALTER TABLE `Galeries` ADD COLUMN `ImagePublicId` varchar(255) NULL'
                );
                PREPARE add_galeries_image_public_id FROM @sql;
                EXECUTE add_galeries_image_public_id;
                DEALLOCATE PREPARE add_galeries_image_public_id;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ImagePublicId", table: "Plats");
            migrationBuilder.DropColumn(name: "ImagePublicId", table: "Galeries");
        }
    }
}
