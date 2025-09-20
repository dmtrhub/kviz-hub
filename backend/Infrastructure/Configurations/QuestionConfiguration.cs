using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Text)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(q => q.Type)
            .HasConversion<string>()
            .IsRequired();

        builder.HasOne(q => q.Quiz)
            .WithMany(qz => qz.Questions)
            .HasForeignKey(q => q.QuizId);
    }
}