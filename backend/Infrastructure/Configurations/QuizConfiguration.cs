using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class QuizConfiguration : IEntityTypeConfiguration<Quiz>
{
    public void Configure(EntityTypeBuilder<Quiz> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(q => q.Description)
               .IsRequired()
               .HasMaxLength(1000);

        builder.Property(q => q.TimeLimit)
               .IsRequired();
    }
}