using System;
using BudgetBee.Controllers;

namespace BudgetBee.Models
{
	public class Transaction
	{
		public int Id { get; set; }
		public decimal Amount { get; set; }
		public string? Direction { get; set; }
		public DateTime Date { get; set; } = DateTime.Now.Date;

        public int PotId { get; set; }


        //public int CategoryId { get; set; }

        //public Pot Pot { get; set; }
        //public Category Category { get; set; }
    }
}

