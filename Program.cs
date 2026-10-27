var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Libera o acesso do Angular em desenvolvimento
builder.Services.AddCors(o => o.AddPolicy("Angular", p =>
    p.WithOrigins("http://localhost:4200")
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();

app.UseCors("Angular");
app.MapControllers();
app.Run();