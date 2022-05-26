using System;
namespace BudgetBee.Models
{
	public class Pot
	{
		public Pot()
        {
			Transaction = new List<Transaction>();

		}

		public int Id { get; set; }
		public string? Name { get; set; }
		public decimal Amount { get; set; }

		public List<Transaction> Transaction { get; set; }
	}
}