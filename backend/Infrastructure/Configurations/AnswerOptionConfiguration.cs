using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class AnswerOptionConfiguration : IEntityTypeConfiguration<AnswerOption>
{
    public void Configure(EntityTypeBuilder<AnswerOption> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Text)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(a => a.IsCorrect)
            .IsRequired();

        builder.HasOne(a => a.Question)
            .WithMany(q => q.AnswerOptions)
            .HasForeignKey(a => a.QuestionId);
    }
}