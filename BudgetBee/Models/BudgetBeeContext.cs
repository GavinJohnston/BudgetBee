using System;
using Microsoft.EntityFrameworkCore;

namespace BudgetBee.Models
{
	public class BudgetBeeContext : DbContext
	{
        public BudgetBeeContext(DbContextOptions<BudgetBeeContext> options) : base(options)
		{
		}

		
		public DbSet<Pot> Pot { get; set; }
		public DbSet<Transaction> Transaction { get; set; }
	}
}

// CODE FIRST MIGRATION
//
// Commands: 
// dotnet ef
// dotnet ef migrations add createinitial
// dotnet ef database update

// ef migrations remove