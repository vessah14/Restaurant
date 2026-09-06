using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class AddCloudinaryPublicIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePublicId",
                table: "Plats",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ImagePublicId",
                table: "Galeries",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                table: "Plats");

            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                table: "Galeries");
        }
    }
}
