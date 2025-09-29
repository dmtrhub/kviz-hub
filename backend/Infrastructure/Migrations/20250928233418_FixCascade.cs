using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KvizHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAnswerDetails_AnswerOptions_AnswerOptionId",
                table: "UserAnswerDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_UserAnswerDetails_UserAnswers_UserAnswerId",
                table: "UserAnswerDetails");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAnswerDetails_AnswerOptions_AnswerOptionId",
                table: "UserAnswerDetails",
                column: "AnswerOptionId",
                principalTable: "AnswerOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserAnswerDetails_UserAnswers_UserAnswerId",
                table: "UserAnswerDetails",
                column: "UserAnswerId",
                principalTable: "UserAnswers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAnswerDetails_AnswerOptions_AnswerOptionId",
                table: "UserAnswerDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_UserAnswerDetails_UserAnswers_UserAnswerId",
                table: "UserAnswerDetails");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAnswerDetails_AnswerOptions_AnswerOptionId",
                table: "UserAnswerDetails",
                column: "AnswerOptionId",
                principalTable: "AnswerOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserAnswerDetails_UserAnswers_UserAnswerId",
                table: "UserAnswerDetails",
                column: "UserAnswerId",
                principalTable: "UserAnswers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
