import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, deleteRecipe, mealPlan, addToMealPlan } =
    useContext(RecipeContext);

  // Find the recipe with the matching id
  const recipe = recipes.find((recipe) => recipe.id === id);

  // State for the selected day to add to meal plan
  const [selectedDay, setSelectedDay] = useState("monday");
  const [showAlert, setShowAlert] = useState(false);

  // If recipe not found, show error
  if (!recipe) {
    return (
      <div className="alert alert-danger">
        Rezept nicht gefunden.{" "}
        <button onClick={() => navigate("/")} className="btn">
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  // Calculate total time
  const totalTime = recipe.prepTime + recipe.cookTime;

  // Function to add recipe to meal plan
  const handleAddToMealPlan = () => {
    addToMealPlan(selectedDay, recipe.id);
    setShowAlert(true);

    // Hide the alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Function to confirm and delete recipe
  const handleDeleteRecipe = () => {
    if (
      window.confirm("Bist du sicher, dass du dieses Rezept löschen möchtest?")
    ) {
      deleteRecipe(recipe.id);
      navigate("/");
    }
  };

  // Format day names for display
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

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          &larr; Zurück
        </button>

        <div>
          <button
            onClick={() => navigate(`/edit/${recipe.id}`)}
            className="btn"
            style={{ marginLeft: "10px" }}
          >
            Rezept bearbeiten
          </button>
          <button
            onClick={handleDeleteRecipe}
            className="btn btn-secondary"
            style={{ marginLeft: "10px" }}
          >
            Rezept löschen
          </button>
        </div>
      </div>

      {showAlert && (
        <div className="alert alert-success">
          Rezept wurde zum Essensplan für {formatDay(selectedDay)} hinzugefügt!
        </div>
      )}

      <div className="card" style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
          {recipe.image && (
            <div style={{ flex: "0 0 300px" }}>
              <img
                src={recipe.image}
                alt={recipe.name}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          )}

          <div style={{ flex: 1, minWidth: "300px" }}>
            <h2 style={{ marginTop: 0 }}>{recipe.name}</h2>
            <p>{recipe.description}</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              <div>
                <strong>Zubereitungszeit:</strong> {totalTime} Minuten
                <div style={{ fontSize: "0.9em", color: "#666" }}>
                  (Vorbereitung: {recipe.prepTime} Min, Kochen:{" "}
                  {recipe.cookTime} Min)
                </div>
              </div>

              <div>
                <strong>Portionen:</strong> {recipe.servings}
              </div>

              <div>
                <strong>Kalorien:</strong> {recipe.calories} kcal pro Portion
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <strong>Schwierigkeitsgrad:</strong> {recipe.difficulty}
            </div>

            <div style={{ marginTop: "5px" }}>
              <strong>Preis:</strong> {recipe.price}
            </div>

            <div style={{ marginTop: "5px" }}>
              <strong>Geschmack:</strong> {recipe.taste}
            </div>

            {recipe.categories && recipe.categories.length > 0 && (
              <div className="recipe-tags" style={{ marginTop: "15px" }}>
                {recipe.categories.map((category) => (
                  <span key={category} className="recipe-tag">
                    {category}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
              <select
                className="form-control"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                style={{ maxWidth: "200px" }}
              >
                <option value="monday">Montag</option>
                <option value="tuesday">Dienstag</option>
                <option value="wednesday">Mittwoch</option>
                <option value="thursday">Donnerstag</option>
                <option value="friday">Freitag</option>
                <option value="saturday">Samstag</option>
                <option value="sunday">Sonntag</option>
              </select>

              <button onClick={handleAddToMealPlan} className="btn">
                Zum Essensplan hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: "1 1 300px" }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Zutaten</h3>
            <p style={{ color: "#666" }}>Für {recipe.servings} Portionen</p>

            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{ingredient.name}</span>
                  <span>
                    {ingredient.amount && ingredient.amount + " "}
                    {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ flex: "1 1 400px" }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Zubereitung</h3>
            <ol style={{ paddingLeft: "20px" }}>
              {recipe.instructions.map((step, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
