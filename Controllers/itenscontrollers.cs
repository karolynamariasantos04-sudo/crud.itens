using ItensApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

namespace ItensApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItensController : ControllerBase
{
    // Armazenamento em memória (os dados somem ao reiniciar a API)
    private static readonly ConcurrentDictionary<int, Item> _itens = new();
    private static int _proximoId = 0;

    // GET api/itens
    [HttpGet]
    public ActionResult<IEnumerable<Item>> Listar() =>
        Ok(_itens.Values.OrderBy(i => i.Id));

    // GET api/itens/5
    [HttpGet("{id:int}")]
    public ActionResult<Item> ObterPorId(int id) =>
        _itens.TryGetValue(id, out var item) ? Ok(item) : NotFound();

    // POST api/itens
    [HttpPost]
    public ActionResult<Item> Criar(Item novo)
    {
        novo.Id = Interlocked.Increment(ref _proximoId);
        _itens[novo.Id] = novo;
        return CreatedAtAction(nameof(ObterPorId), new { id = novo.Id }, novo);
    }

    // PUT api/itens/5
    [HttpPut("{id:int}")]
    public IActionResult Atualizar(int id, Item atualizado)
    {
        if (!_itens.ContainsKey(id)) return NotFound();
        atualizado.Id = id;
        _itens[id] = atualizado;
        return NoContent();
    }

    // DELETE api/itens/5
    [HttpDelete("{id:int}")]
    public IActionResult Excluir(int id) =>
        _itens.TryRemove(id, out _) ? NoContent() : NotFound();
}