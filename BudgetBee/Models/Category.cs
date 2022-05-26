using System;
using System.Transactions;

namespace BudgetBee.Models
{
	public class Category
	{
		public Category()
        {
			Transaction = new List<Transaction>();
        }

		public int Id { get; set; }
		public string? Name { get; set; }

		public List<Transaction> Transaction { get; set; }
	}
}

