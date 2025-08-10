using KvizHub.Domain.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class UserAnswerDetailConfiguration : IEntityTypeConfiguration<UserAnswerDetail>
{
    public void Configure(EntityTypeBuilder<UserAnswerDetail> builder)
    {
        builder.HasKey(ad => ad.Id);

        builder.Property(ad => ad.TextAnswer)
            .HasMaxLength(500);
    }
}
