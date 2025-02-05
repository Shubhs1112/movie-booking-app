﻿// <auto-generated />
using System;
using Admin_Management_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Admin_Management_API.Migrations
{
    [DbContext(typeof(P18MoviebookingsystemContext))]
    [Migration("20250204175929_AddNewTable")]
    partial class AddNewTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseCollation("utf8mb4_0900_ai_ci")
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.HasCharSet(modelBuilder, "utf8mb4");

            modelBuilder.Entity("Admin_Management_API.Models.Booking", b =>
                {
                    b.Property<int>("BookingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("booking_id");

                    b.Property<decimal>("BookingAmount")
                        .HasPrecision(10, 2)
                        .HasColumnType("decimal(10,2)")
                        .HasColumnName("booking_amount");

                    b.Property<DateTime>("BookingDate")
                        .HasColumnType("datetime")
                        .HasColumnName("booking_date");

                    b.Property<TimeOnly>("BookingTime")
                        .HasColumnType("time")
                        .HasColumnName("booking_time");

                    b.Property<int>("SeatId")
                        .HasColumnType("int")
                        .HasColumnName("seat_id");

                    b.Property<int>("ShowId")
                        .HasColumnType("int")
                        .HasColumnName("show_id");

                    b.Property<int>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.HasKey("BookingId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "ShowId" }, "booking_ibfk_1");

                    b.HasIndex(new[] { "SeatId" }, "booking_ibfk_2");

                    b.HasIndex(new[] { "UserId" }, "booking_ibfk_3");

                    b.ToTable("booking", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("category_id");

                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("category_name");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(65,30)");

                    b.HasKey("CategoryId")
                        .HasName("PRIMARY");

                    b.ToTable("category", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.Movie", b =>
                {
                    b.Property<int>("MovieId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("movie_id");

                    b.Property<string>("MovieDescription")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("movie_description");

                    b.Property<TimeOnly>("MovieDuration")
                        .HasColumnType("time")
                        .HasColumnName("movie_duration");

                    b.Property<string>("MovieGenre")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("movie_genre");

                    b.Property<string>("MovieLanguage")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("movie_language");

                    b.Property<string>("MovieName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("movie_name");

                    b.Property<string>("MoviePoster")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("movie_poster");

                    b.Property<DateOnly>("MovieReleaseDate")
                        .HasColumnType("date")
                        .HasColumnName("movie_release_date");

                    b.HasKey("MovieId")
                        .HasName("PRIMARY");

                    b.ToTable("movie", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("role_id");

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("role_name");

                    b.HasKey("RoleId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "RoleName" }, "role_name")
                        .IsUnique();

                    b.ToTable("role", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.Screen", b =>
                {
                    b.Property<int>("ScreenId")
                        .HasColumnType("int")
                        .HasColumnName("screen_id");

                    b.Property<int>("CategoryId")
                        .HasColumnType("int")
                        .HasColumnName("category_id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("description");

                    b.Property<int>("ScreenNumber")
                        .HasColumnType("int")
                        .HasColumnName("screen_number");

                    b.HasKey("ScreenId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "CategoryId" }, "screen_ibfk_1");

                    b.ToTable("screen", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.Seat", b =>
                {
                    b.Property<int>("SeatId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("seat_id");

                    b.Property<int?>("Column")
                        .HasColumnType("int")
                        .HasColumnName("_column");

                    b.Property<bool?>("IsAvailable")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("is_available")
                        .HasDefaultValueSql("'1'");

                    b.Property<string>("Row")
                        .HasMaxLength(2)
                        .HasColumnType("varchar(2)")
                        .HasColumnName("_row");

                    b.Property<int>("ScreenId")
                        .HasColumnType("int")
                        .HasColumnName("screen_id");

                    b.HasKey("SeatId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "ScreenId" }, "seat_ibfk_1");

                    b.ToTable("seat", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("varchar(60)")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(45)
                        .HasColumnType("varchar(45)")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(45)
                        .HasColumnType("varchar(45)")
                        .HasColumnName("last_name");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("password");

                    b.Property<string>("Phone")
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)")
                        .HasColumnName("phone");

                    b.Property<int>("RoleId")
                        .HasColumnType("int")
                        .HasColumnName("role_id");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("username");

                    b.HasKey("UserId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "RoleId" }, "user_ibfk_1");

                    b.HasIndex(new[] { "Username" }, "username")
                        .IsUnique();

                    b.ToTable("user", (string)null);
                });

            modelBuilder.Entity("Show", b =>
                {
                    b.Property<int>("ShowId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("show_id");

                    b.Property<int>("MovieId")
                        .HasColumnType("int")
                        .HasColumnName("movie_id");

                    b.Property<int>("ScreenId")
                        .HasColumnType("int")
                        .HasColumnName("screen_id");

                    b.Property<DateTime>("ShowDate")
                        .HasColumnType("datetime(6)")
                        .HasColumnName("show_date");

                    b.Property<TimeSpan>("ShowTime")
                        .HasColumnType("time")
                        .HasColumnName("show_time");

                    b.HasKey("ShowId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "MovieId" }, "shows_ibfk_1");

                    b.HasIndex(new[] { "ScreenId" }, "shows_ibfk_2");

                    b.ToTable("shows", (string)null);
                });

            modelBuilder.Entity("Admin_Management_API.Models.Booking", b =>
                {
                    b.HasOne("Admin_Management_API.Models.Seat", "Seat")
                        .WithMany("Bookings")
                        .HasForeignKey("SeatId")
                        .IsRequired()
                        .HasConstraintName("booking_ibfk_2");

                    b.HasOne("Show", "Show")
                        .WithMany("Bookings")
                        .HasForeignKey("ShowId")
                        .IsRequired()
                        .HasConstraintName("booking_ibfk_1");

                    b.HasOne("Admin_Management_API.Models.User", "User")
                        .WithMany("Bookings")
                        .HasForeignKey("UserId")
                        .IsRequired()
                        .HasConstraintName("booking_ibfk_3");

                    b.Navigation("Seat");

                    b.Navigation("Show");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Screen", b =>
                {
                    b.HasOne("Admin_Management_API.Models.Category", "Category")
                        .WithMany("Screens")
                        .HasForeignKey("CategoryId")
                        .IsRequired()
                        .HasConstraintName("screen_ibfk_1");

                    b.Navigation("Category");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Seat", b =>
                {
                    b.HasOne("Admin_Management_API.Models.Screen", "Screen")
                        .WithMany("Seats")
                        .HasForeignKey("ScreenId")
                        .IsRequired()
                        .HasConstraintName("seat_ibfk_1");

                    b.Navigation("Screen");
                });

            modelBuilder.Entity("Admin_Management_API.Models.User", b =>
                {
                    b.HasOne("Admin_Management_API.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .IsRequired()
                        .HasConstraintName("user_ibfk_1");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("Show", b =>
                {
                    b.HasOne("Admin_Management_API.Models.Movie", "Movie")
                        .WithMany("Shows")
                        .HasForeignKey("MovieId")
                        .IsRequired()
                        .HasConstraintName("shows_ibfk_1");

                    b.HasOne("Admin_Management_API.Models.Screen", "Screen")
                        .WithMany("Shows")
                        .HasForeignKey("ScreenId")
                        .IsRequired()
                        .HasConstraintName("shows_ibfk_2");

                    b.Navigation("Movie");

                    b.Navigation("Screen");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Category", b =>
                {
                    b.Navigation("Screens");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Movie", b =>
                {
                    b.Navigation("Shows");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Screen", b =>
                {
                    b.Navigation("Seats");

                    b.Navigation("Shows");
                });

            modelBuilder.Entity("Admin_Management_API.Models.Seat", b =>
                {
                    b.Navigation("Bookings");
                });

            modelBuilder.Entity("Admin_Management_API.Models.User", b =>
                {
                    b.Navigation("Bookings");
                });

            modelBuilder.Entity("Show", b =>
                {
                    b.Navigation("Bookings");
                });
#pragma warning restore 612, 618
        }
    }
}
