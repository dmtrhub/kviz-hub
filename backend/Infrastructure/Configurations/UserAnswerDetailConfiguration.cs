using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class UserAnswerDetailConfiguration : IEntityTypeConfiguration<UserAnswerDetail>
{
    public void Configure(EntityTypeBuilder<UserAnswerDetail> builder)
    {
        builder.HasKey(ad => ad.Id);

        builder.HasOne(ad => ad.UserAnswer)
               .WithMany(ua => ua.AnswerDetails)
               .HasForeignKey(ad => ad.UserAnswerId)
               .OnDelete(DeleteBehavior.ClientCascade);

        builder.HasOne(ad => ad.AnswerOption)
               .WithMany()
               .HasForeignKey(ad => ad.AnswerOptionId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}