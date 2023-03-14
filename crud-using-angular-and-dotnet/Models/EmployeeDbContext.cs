using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace crud_using_angular_and_dotnet.Models;

public partial class EmployeeDbContext : DbContext
{
    public EmployeeDbContext()
    {
    }

    public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__City__F2D21A96079447BE");

            entity.ToTable("City");

            entity.Property(e => e.CityId).HasColumnName("CityID");
            entity.Property(e => e.CityName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04FF1C3AD0958");

            entity.ToTable("Employee");

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.City)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Department)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
