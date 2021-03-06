using System;
using BudgetBee.Controllers;

namespace BudgetBee.Models
{
	public class Transaction
	{
		public int Id { get; set; }
		public decimal Amount { get; set; }
		public string? Direction { get; set; }
		public string? PotName { get; set; }
		public string? Category { get; set; }
		public DateTime Date { get; set; } = DateTime.Now.Date.ToLocalTime();

        public int PotId { get; set; }
    }
}