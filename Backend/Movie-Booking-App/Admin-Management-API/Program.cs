using Admin_Management_API.Models;
using Steeltoe.Discovery.Client;
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
                options.AddPolicy("AllowAll",
                    policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
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

            builder.Services.AddDiscoveryClient(builder.Configuration);
            

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Use Steeltoe Discovery Client
            app.UseDiscoveryClient();

            // Middlewares
            //app.UseHttpsRedirection();
            //app.UseCors("AllowAll");
            app.UseStaticFiles();         // Enable serving static files
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();  
            // Maps API endpoints

            app.Run();
        }
    }
}
