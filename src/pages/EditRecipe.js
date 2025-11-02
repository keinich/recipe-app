import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, updateRecipe } = useContext(RecipeContext);

  // Find the recipe with the matching id
  const recipe = recipes.find((recipe) => recipe.id === id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    calories: 0,
    difficulty: "Einfach",
    price: "Günstig",
    taste: "Herzhaft",
    categories: [],
    ingredients: [{ name: "", amount: "", unit: "", category: "" }],
    instructions: [""],
  });

  // Load recipe data when component mounts
  useEffect(() => {
    if (recipe) {
      setFormData({
        ...recipe,
        // Ensure arrays are copied to prevent reference issues
        categories: [...recipe.categories],
        ingredients: recipe.ingredients.map((ing) => ({ ...ing })),
        instructions:
          recipe.instructions && recipe.instructions.length
            ? [...recipe.instructions]
            : [""], // Ensure at least one empty instruction field
      });
    } else {
      // Redirect to home if recipe not found
      navigate("/");
    }
  }, [recipe, navigate]);

  // Categories for users to select
  const categoryOptions = [
    "Hauptgericht",
    "Vorspeise",
    "Dessert",
    "Snack",
    "Frühstück",
    "Suppe",
    "Salat",
    "Vegetarisch",
    "Vegan",
    "Fleisch",
    "Fisch",
    "Pasta",
    "Reis",
    "Pizza",
    "Low Carb",
    "Gesund",
    "Italienisch",
    "Deutsch",
    "Asiatisch",
    "Mexikanisch",
    "Indisch",
    "Schnell",
    "Geflügel",
    "Überbacken",
    "Ofen",
    "Sauce",
    "Auflauf",
    "Eintopf",
    "Traditionell",
    "Fitness",
    "Scharf",
    "Protein",
  ];

  // Difficulty options
  const difficultyOptions = ["Einfach", "Mittel", "Schwer"];

  // Price options
  const priceOptions = ["Sehr günstig", "Günstig", "Mittel", "Gehoben"];

  // Taste options
  const tasteOptions = [
    "Herzhaft",
    "Süß",
    "Scharf",
    "Mild",
    "Sauer",
    "Würzig",
    "Frisch",
    "Cremig",
  ];

  // Ingredient category options
  const ingredientCategories = [
    "Fleisch",
    "Fisch",
    "Gemüse",
    "Obst",
    "Kräuter",
    "Gewürze",
    "Nudeln",
    "Reis",
    "Getreide",
    "Milchprodukte",
    "Eier",
    "Backwaren",
    "Konserven",
    "Öle",
    "Saucen",
    "Getränke",
    "Süßwaren",
    "Tiefkühl",
    "Kühlung",
    "Nüsse",
    "Hülsenfrüchte",
    "Essig",
    "Fitness",
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes to number inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  // Handle category selection (multiple checkboxes)
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, value],
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(
          (category) => category !== value
        ),
      });
    }
  };

  // Handle changes to ingredients
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  // Add a new empty ingredient field
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: "", amount: "", unit: "", category: "" },
      ],
    });
  };

  // Remove an ingredient
  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  // Handle changes to instructions
  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  // Add a new empty instruction field
  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""],
    });
  };

  // Remove an instruction
  const removeInstruction = (index) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions.splice(index, 1);
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  // Submit the form to update the recipe
  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out any empty ingredients or instructions
    const filteredIngredients = formData.ingredients.filter(
      (ing) => ing.name.trim() !== ""
    );
    const filteredInstructions = formData.instructions.filter(
      (inst) => inst.trim() !== ""
    );

    // Create the updated recipe object
    const updatedRecipe = {
      ...formData,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
    };

    // Update the recipe in context
    updateRecipe(id, updatedRecipe);

    // Navigate back to recipe detail page
    navigate(`/recipe/${id}`);
  };

  // If recipe not loaded yet or not found, show loading or error message
  if (!recipe) {
    return <div>Rezept wird geladen...</div>;
  }

  return (
    <div>
      <h2>Rezept bearbeiten</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Basic information */}
          <div className="form-group">
            <label htmlFor="name">Name des Rezepts *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Beschreibung</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Bild URL (optional)</label>
            <input
              type="url"
              id="image"
              name="image"
              className="form-control"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Cooking details */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div className="form-group" style={{ minWidth: "150px" }}>
              <label htmlFor="prepTime">Vorbereitungszeit (Minuten)</label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                className="form-control"
                value={formData.prepTime}
                onChange={handleNumberChange}
                min="0"
              />
            </div>

            <div className="form-group" style={{ minWidth: "150px" }}>
              <label htmlFor="cookTime">Kochzeit (Minuten)</label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                className="form-control"
                value={formData.cookTime}
                onChange={handleNumberChange}
                min="0"
              />
            </div>

            <div className="form-group" style={{ minWidth: "150px" }}>
              <label htmlFor="servings">Portionen</label>
              <input
                type="number"
                id="servings"
                name="servings"
                className="form-control"
                value={formData.servings}
                onChange={handleNumberChange}
                min="1"
              />
            </div>

            <div className="form-group" style={{ minWidth: "150px" }}>
              <label htmlFor="calories">Kalorien (pro Portion)</label>
              <input
                type="number"
                id="calories"
                name="calories"
                className="form-control"
                value={formData.calories}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
          </div>

          {/* Categories and other attributes */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div style={{ minWidth: "200px" }}>
              <label htmlFor="difficulty">Schwierigkeitsgrad</label>
              <select
                id="difficulty"
                name="difficulty"
                className="form-control"
                value={formData.difficulty}
                onChange={handleChange}
              >
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: "200px" }}>
              <label htmlFor="price">Preis</label>
              <select
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
              >
                {priceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: "200px" }}>
              <label htmlFor="taste">Geschmack</label>
              <select
                id="taste"
                name="taste"
                className="form-control"
                value={formData.taste}
                onChange={handleChange}
              >
                {tasteOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Kategorien</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "8px",
              }}
            >
              {categoryOptions.map((option) => (
                <div
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "150px",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`category-${option}`}
                    value={option}
                    checked={formData.categories.includes(option)}
                    onChange={handleCategoryChange}
                    style={{ marginRight: "5px" }}
                  />
                  <label htmlFor={`category-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <h3>Zutaten</h3>
          {formData.ingredients.map((ingredient, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 2 }}>
                <input
                  type="text"
                  placeholder="Zutat"
                  className="form-control"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  required={index === 0}
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Menge"
                  className="form-control"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Einheit"
                  className="form-control"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                />
              </div>

              <div style={{ flex: 1.5 }}>
                <select
                  className="form-control"
                  value={ingredient.category}
                  onChange={(e) =>
                    handleIngredientChange(index, "category", e.target.value)
                  }
                  required={index === 0}
                >
                  <option value="">Kategorie wählen</option>
                  {ingredientCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {index > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => removeIngredient(index)}
                  style={{ padding: "5px 10px" }}
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn"
            onClick={addIngredient}
            style={{ marginBottom: "20px" }}
          >
            + Zutat hinzufügen
          </button>

          {/* Instructions */}
          <h3>Zubereitungsschritte</h3>
          {formData.instructions.map((instruction, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "0 0 30px", textAlign: "center" }}>
                {index + 1}.
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder={`Schritt ${index + 1}`}
                  className="form-control"
                  value={instruction}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  required={index === 0}
                />
              </div>

              {index > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => removeInstruction(index)}
                  style={{ padding: "5px 10px" }}
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn"
            onClick={addInstruction}
            style={{ marginBottom: "20px" }}
          >
            + Schritt hinzufügen
          </button>

          {/* Submit button */}
          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              className="btn"
              style={{ marginRight: "10px" }}
            >
              Änderungen speichern
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/recipe/${id}`)}
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
