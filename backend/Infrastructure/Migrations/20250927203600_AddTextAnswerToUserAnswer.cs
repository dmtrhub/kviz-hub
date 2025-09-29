using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTextAnswerToUserAnswer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextAnswer",
                table: "UserAnswers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TextAnswer",
                table: "UserAnswers");
        }
    }
}
