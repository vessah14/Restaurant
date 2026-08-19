using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class RestaurantDbContext : DbContext
    {
        public RestaurantDbContext(
            DbContextOptions<RestaurantDbContext> options
        ) : base(options)
        {
        }

        public DbSet<Utilisateur> Utilisateurs => Set<Utilisateur>();

        public DbSet<Avis> Avis => Set<Avis>();
        public DbSet<Reservation> Reservations => Set<Reservation>();
        public DbSet<Faq> Faqs => Set<Faq>();
        public DbSet<ReseauSocial> ReseauxSociaux => Set<ReseauSocial>();
        public DbSet<Page> Pages => Set<Page>();
        public DbSet<PageContenu> PagesContenu => Set<PageContenu>();
        public DbSet<FaqTraduction> FaqTraductions => Set<FaqTraduction>();
        public DbSet<CategorieMenu> CategoriesMenu => Set<CategorieMenu>();
        public DbSet<CategorieMenuTraduction> CategoriesMenuTraductions => Set<CategorieMenuTraduction>();
        public DbSet<Plat> Plats => Set<Plat>();
        public DbSet<PlatTraduction> PlatsTraductions => Set<PlatTraduction>();
        public DbSet<Galerie> Galeries => Set<Galerie>();
        public DbSet<GalerieTraduction> GalerieTraductions => Set<GalerieTraduction>();
        public DbSet<ContactInfos> ContactInfos => Set<ContactInfos>();
        public DbSet<ContactInfosTraduction> ContactInfosTraductions => Set<ContactInfosTraduction>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Visite> Visites => Set<Visite>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FaqTraduction>()
                .HasOne(t => t.Faq)
                .WithMany(f => f.Traductions)
                .HasForeignKey(t => t.FaqId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FaqTraduction>()
                .HasIndex(t => new { t.FaqId, t.Langue })
                .IsUnique();

            modelBuilder.Entity<CategorieMenuTraduction>()
                .HasOne(t => t.Categorie)
                .WithMany(c => c.Traductions)
                .HasForeignKey(t => t.CategorieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CategorieMenuTraduction>()
                .HasIndex(t => new { t.CategorieId, t.Langue })
                .IsUnique();

            modelBuilder.Entity<Plat>()
                .HasOne(p => p.Categorie)
                .WithMany(c => c.Plats)
                .HasForeignKey(p => p.CategorieId);

            modelBuilder.Entity<PlatTraduction>()
                .HasOne(t => t.Plat)
                .WithMany(p => p.Traductions)
                .HasForeignKey(t => t.PlatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PlatTraduction>()
                .HasIndex(t => new { t.PlatId, t.Langue })
                .IsUnique();

            modelBuilder.Entity<Plat>()
                .Property(p => p.Prix)
                .HasPrecision(6, 2);

            modelBuilder.Entity<GalerieTraduction>()
                .HasOne(t => t.Galerie)
                .WithMany(g => g.Traductions)
                .HasForeignKey(t => t.GalerieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GalerieTraduction>()
                .HasIndex(t => new { t.GalerieId, t.Langue })
                .IsUnique();
            modelBuilder.Entity<ContactInfos>()
                .Property(c => c.Latitude)
                .HasPrecision(10, 7);

            modelBuilder.Entity<ContactInfos>()
                .Property(c => c.Longitude)
                .HasPrecision(10, 7);

            modelBuilder.Entity<ContactInfosTraduction>()
                .HasIndex(t => t.Langue)
                .IsUnique();
            modelBuilder.Entity<PageContenu>()
                .HasOne(c => c.Page)
                .WithMany(p => p.Contenus)
                .HasForeignKey(c => c.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PageContenu>()
                .HasIndex(c => new { c.PageId, c.Langue })
                .IsUnique();

            modelBuilder.Entity<Page>()
                .HasIndex(p => p.Slug)
                .IsUnique();

            modelBuilder.Entity<Visite>()
                .HasIndex(v => new { v.SessionId, v.DateVisite });
        }

    }
}