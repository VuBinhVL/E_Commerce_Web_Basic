using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace API.Data
{
	public class StoreContext : DbContext
	{
		public StoreContext(DbContextOptions<StoreContext> options) : base(options)
		{
		}

		// Define DbSets for your entities here
		public DbSet<Product> Products { get; set; }
	}
}