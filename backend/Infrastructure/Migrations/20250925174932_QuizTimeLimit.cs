using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class QuizTimeLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TimeLimit",
                table: "Quizzes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeLimit",
                table: "Quizzes");
        }
    }
}
