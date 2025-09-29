using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DurationLeaderboard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "LeaderboardEntries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "LeaderboardEntries");
        }
    }
}
