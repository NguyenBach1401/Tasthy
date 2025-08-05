using Microsoft.EntityFrameworkCore;
using Tasthy_Backend.Models;
using YourNamespace.Models;
namespace Tasthy_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Recipe>Recipes => Set<Recipe>();
        public DbSet<RecipeTag> RecipeTags => Set<RecipeTag>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<Nutrition> Nutritions => Set<Nutrition>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Favorite> Favorites => Set<Favorite>();
        public DbSet<Exercise> Exercises => Set<Exercise>();
        public DbSet<SelectedMeal> SelectedMeals { get; set; }
        public DbSet<CustomMeal> CustomMeals { get; set; }
        public DbSet<CustomExercise> CustomExercises { get; set; }
        public DbSet<UserExercise> UserExercises { get;set; }
        public DbSet<Routine> Routine => Set<Routine>();
        public DbSet<RoutineDetail> RoutineDetails => Set<RoutineDetail>();
        public DbSet<UserWorkoutPlan> UserWorkoutPlan => Set<UserWorkoutPlan>();
        public DbSet<UserRoutineCheckin> UserRoutineCheckin => Set<UserRoutineCheckin>();
        public DbSet<FoodGoalSnapshot> FoodGoalSnapshot => Set<FoodGoalSnapshot>();
        public DbSet<ExerciseGoalSnapshot> ExerciseGoalSnapshot => Set<ExerciseGoalSnapshot>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Nutrition>().HasKey(n => n.NutritionsID);
            modelBuilder.Entity<RecipeTag>().HasKey(rt => new { rt.RecipeID, rt.TagID });
            modelBuilder.Entity<RecipeTag>()
                .HasOne(rt => rt.Recipe)
                .WithMany(r => r.RecipeTags)
                .HasForeignKey(rt => rt.RecipeID);
            modelBuilder.Entity<RecipeTag>()
                .HasOne(rt => rt.Tag)
                .WithMany(t => t.RecipeTags)
                .HasForeignKey(rt => rt.TagID);

            modelBuilder.Entity<Nutrition>()
               .Property(n => n.Calories)
               .HasColumnType("float");

            modelBuilder.Entity<Nutrition>()
                        .Property(n => n.Protein)
                        .HasColumnType("float");

            modelBuilder.Entity<Nutrition>()
                        .Property(n => n.Carbs)
                        .HasColumnType("float");

            modelBuilder.Entity<Nutrition>()
                        .Property(n => n.Fat)
                        .HasColumnType("float");

            modelBuilder.Entity<User>()
                        .Property(n=>n.WeightKg)
                        .HasColumnType("float");
            modelBuilder.Entity<User>()
                        .Property(n => n.BMI)
                        .HasColumnType("float");
            modelBuilder.Entity<User>()
                        .Property(n => n.BMR)
                        .HasColumnType("float");
            modelBuilder.Entity<User>()
                        .Property(n => n.TDEE)
                        .HasColumnType("float");
            modelBuilder.Entity<Comment>()
                        .HasOne(c => c.User)
                        .WithMany(u => u.Comments)
                        .HasForeignKey(c => c.UserID);


            modelBuilder.Entity<ExerciseGoalSnapshot>()
        .HasKey(e => new { e.UserId, e.LastDate });

            modelBuilder.Entity<FoodGoalSnapshot>()
                .HasKey(f => new { f.UserId, f.LastDate });

        }
    }
}
