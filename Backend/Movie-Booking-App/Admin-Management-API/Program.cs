using Admin_Management_API.Models;
using System.Text.Json.Serialization;

namespace Admin_Management_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            //CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    // Allows CORS requests from React app running on port 3000
                    policy.WithOrigins("http://localhost:3000")  // Replace with the URL of your React app
                          .AllowAnyMethod()                     // Allow any HTTP method (GET, POST, etc.)
                          .AllowAnyHeader();                    // Allow any headers
                });
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<P18MoviebookingsystemContext>();
            builder.Services.AddControllers().AddJsonOptions(option =>
            {
                option.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                option.JsonSerializerOptions.WriteIndented = true;
            });
            builder.Services.AddCors(policybuilder => policybuilder.AddDefaultPolicy(policy =>
            policy.WithOrigins("*").AllowAnyHeader().AllowAnyHeader()));


            var app = builder.Build();

            // Use CORS middleware with the defined policy
            app.UseCors("AllowReactApp");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseStaticFiles(); // Enable static files to be served from the wwwroot folder


            app.MapControllers();

            app.Run();
        }
    }
}
