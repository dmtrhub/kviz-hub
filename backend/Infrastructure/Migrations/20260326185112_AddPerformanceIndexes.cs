using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_QuizAttempts_QuizId",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_QuizAttempts_UserId",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_LeaderboardEntries_QuizId",
                table: "LeaderboardEntries");

            migrationBuilder.DropIndex(
                name: "IX_LeaderboardEntries_UserId",
                table: "LeaderboardEntries");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_Title",
                table: "Quizzes",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_Quiz_User_FinishedAt",
                table: "QuizAttempts",
                columns: new[] { "QuizId", "UserId", "FinishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_User_FinishedAt",
                table: "QuizAttempts",
                columns: new[] { "UserId", "FinishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_LeaderboardEntries_Quiz_Score_Duration_AchievedAt",
                table: "LeaderboardEntries",
                columns: new[] { "QuizId", "Score", "Duration", "AchievedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_LeaderboardEntries_User_Quiz",
                table: "LeaderboardEntries",
                columns: new[] { "UserId", "QuizId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Quizzes_Title",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_QuizAttempts_Quiz_User_FinishedAt",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_QuizAttempts_User_FinishedAt",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_LeaderboardEntries_Quiz_Score_Duration_AchievedAt",
                table: "LeaderboardEntries");

            migrationBuilder.DropIndex(
                name: "IX_LeaderboardEntries_User_Quiz",
                table: "LeaderboardEntries");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_QuizId",
                table: "QuizAttempts",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_UserId",
                table: "QuizAttempts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaderboardEntries_QuizId",
                table: "LeaderboardEntries",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaderboardEntries_UserId",
                table: "LeaderboardEntries",
                column: "UserId");
        }
    }
}
