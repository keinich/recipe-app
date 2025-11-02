import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";
import MealPlanStatistics from "../components/MealPlanStatistics";

const MealPlanner = () => {
  const { recipes, mealPlan, removeFromMealPlan, generateShoppingList } =
    useContext(RecipeContext);
  const [showGeneratedAlert, setShowGeneratedAlert] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);

  // Function to get recipe by id
  const getRecipeById = (id) => {
    return recipes.find((recipe) => recipe.id === id);
  };

  // Function to calculate total calories for a day
  const calculateDayCalories = (day) => {
    return mealPlan[day].reduce((total, recipeId) => {
      const recipe = getRecipeById(recipeId);
      return total + (recipe ? recipe.calories : 0);
    }, 0);
  };

  // Function to handle generating shopping list
  const handleGenerateShoppingList = () => {
    generateShoppingList();
    setShowGeneratedAlert(true);

    // Hide the alert after 3 seconds
    setTimeout(() => setShowGeneratedAlert(false), 3000);
  };

  // Format day names
  const formatDay = (day) => {
    const days = {
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
    };
    return days[day] || day;
  };

  // Check if there are any recipes in the meal plan
  const hasRecipes = Object.values(mealPlan).some((day) => day.length > 0);

  return (
    <div>
      <h2>Mein Essensplan</h2>

      {showGeneratedAlert && (
        <div className="alert alert-success">
          Einkaufsliste wurde erfolgreich generiert!
        </div>
      )}

      {/* Statistik-Übersicht mit Toggle-Funktion */}
      <div style={{ marginBottom: "20px" }}>
        <button
          className="btn"
          onClick={() => setShowStatistics(!showStatistics)}
          style={{ marginBottom: "10px" }}
        >
          {showStatistics
            ? "Mahlzeitenübersicht ausblenden"
            : "Mahlzeitenübersicht anzeigen"}
        </button>

        {showStatistics && <MealPlanStatistics />}
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleGenerateShoppingList}
          className="btn"
          disabled={!hasRecipes}
        >
          Einkaufsliste generieren
        </button>
      </div>

      <div className="meal-plan">
        {Object.keys(mealPlan).map((day) => (
          <div key={day} className="meal-plan-day">
            <h3>{formatDay(day)}</h3>

            {mealPlan[day].length === 0 ? (
              <p>
                Keine Rezepte für diesen Tag geplant.{" "}
                <Link to="/">Füge Rezepte hinzu</Link>.
              </p>
            ) : (
              <>
                <p style={{ color: "#666" }}>
                  Gesamtkalorien: {calculateDayCalories(day)} kcal
                </p>

                <div className="recipe-list" style={{ marginTop: "10px" }}>
                  {mealPlan[day].map((recipeId) => {
                    const recipe = getRecipeById(recipeId);

                    if (!recipe) return null;

                    return (
                      <div key={recipeId} className="recipe-card">
                        {recipe.image && (
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="recipe-card-img"
                          />
                        )}
                        <div className="recipe-card-body">
                          <h3 className="recipe-card-title">{recipe.name}</h3>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "10px",
                            }}
                          >
                            <span>
                              {recipe.prepTime + recipe.cookTime} Min.
                            </span>
                            <span>{recipe.calories} kcal</span>
                          </div>

                          <div
                            style={{
                              marginTop: "15px",
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <Link to={`/recipe/${recipe.id}`} className="btn">
                              Details
                            </Link>
                            <button
                              onClick={() => removeFromMealPlan(day, recipeId)}
                              className="btn btn-secondary"
                            >
                              Entfernen
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {!hasRecipes && (
        <div
          className="card"
          style={{ marginTop: "20px", textAlign: "center", padding: "20px" }}
        >
          <p>Dein Essensplan ist noch leer.</p>
          <p>
            Füge Rezepte zu deinem Plan hinzu, um eine Einkaufsliste zu
            generieren.
          </p>
          <Link to="/" className="btn" style={{ marginTop: "10px" }}>
            Rezepte ansehen
          </Link>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
