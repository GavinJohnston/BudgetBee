using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BudgetBee.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.JsonPatch;

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

    [HttpGet("pots/{id}")]
    public async Task<ActionResult<Pot>> GetPot(int id)
    {
        var item = await _context.Pot.FindAsync(id);

        if (item == null)
        {
            return NotFound();
        }

        return item;
    }

    [HttpPatch("pots/{id}")]
    public async Task<IActionResult> EditElement(int id, [FromBody] JsonPatchDocument<Pot> patchEntity)
    {
        var Pot = await _context.Pot.FindAsync(id);

        if (Pot == null)
        {
            return NotFound();
        }

        patchEntity.ApplyTo(Pot, ModelState);

        _context.Entry(Pot).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(Pot);
    }

    [HttpDelete("pots/{id}")]
    public async Task<IActionResult> DeletePot(int id)
    {
        var pot = await _context.Pot.FindAsync(id);
        if (pot == null)
        {
            return NotFound();
        }

        _context.Pot.Remove(pot);
        await _context.SaveChangesAsync();

        return NoContent();
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

