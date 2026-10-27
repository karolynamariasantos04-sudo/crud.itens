using System.ComponentModel.DataAnnotations;

namespace ItensApi.Models;

public class Item
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Descricao { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Preco { get; set; }
}