using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BudgetBee.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetBee.Controllers;

[Route("")]
[ApiController]
public class HomeController : Controller
{

    private readonly BudgetBeeContext _context;

    public HomeController(BudgetBeeContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    [Route("pots")]
    public async Task<ActionResult<Pot>> PostPot(Pot pot)
    {
        _context.Pot.Add(pot);
        await _context.SaveChangesAsync();

        return Ok(pot);
    }

    [HttpGet]
    [Route("pots")]
    public async Task<ActionResult<IEnumerable<Pot>>> GetPots()
    {
        return await _context.Pot.ToListAsync();
    }

    [HttpPost]
    [Route("transaction")]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {
        _context.Transaction.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }

    [HttpGet]
    [Route("transaction")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transaction.ToListAsync();
    }
}

