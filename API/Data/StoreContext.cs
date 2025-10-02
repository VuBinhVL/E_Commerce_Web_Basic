using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class StoreContext : IdentityDbContext<User>
	{
		public StoreContext(DbContextOptions<StoreContext> options) : base(options)
		{
		}

		// Define DbSets for your entities here
		public DbSet<Product> Products { get; set; }
		public DbSet<Basket> Baskets { get; set; }
		public DbSet<BasketItem> BasketItems { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.Entity<IdentityRole>()
					.HasData(
						new IdentityRole { Id = "1", Name = "Member", NormalizedName = "MEMBER" },
						new IdentityRole { Id = "2", Name = "Admin", NormalizedName = "ADMIN" });

		}
	}
}