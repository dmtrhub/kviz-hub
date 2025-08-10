using KvizHub.Domain.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class QuizCategoryConfiguration : IEntityTypeConfiguration<QuizCategory>
{
    public void Configure(EntityTypeBuilder<QuizCategory> builder)
    {
        builder.HasKey(qc => new { qc.QuizId, qc.CategoryId });

        builder.HasOne(qc => qc.Quiz)
            .WithMany(q => q.QuizCategories)
            .HasForeignKey(qc => qc.QuizId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(qc => qc.Category)
            .WithMany(c => c.QuizCategories)
            .HasForeignKey(qc => qc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
