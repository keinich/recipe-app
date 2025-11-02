import React, { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";
import "../styles/TableView.css";

const Home = () => {
  // Export all recipes as JSON to clipboard
  const exportRecipesJson = () => {
    const json = JSON.stringify(recipes, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        alert("Alle Rezepte wurden als JSON in die Zwischenablage kopiert!");
      });
    } else {
      alert(json); // fallback: show JSON for manual copy
    }
  };
  const { recipes } = useContext(RecipeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterTaste, setFilterTaste] = useState("");
  const [filterCalories, setFilterCalories] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' oder 'table'

  // Get all unique categories, difficulties, prices, and tastes for filter options
  const categories = [
    ...new Set(recipes.flatMap((recipe) => recipe.categories || [])),
  ];
  const difficulties = [...new Set(recipes.map((recipe) => recipe.difficulty))];
  const prices = [...new Set(recipes.map((recipe) => recipe.price))];
  const tastes = [...new Set(recipes.map((recipe) => recipe.taste))];

  // Definiere Kalorienbereiche für den Filter
  const calorieRanges = [
    {
      id: "sehr-niedrig",
      label: "Sehr niedrig (< 300 kcal)",
      min: 0,
      max: 299,
    },
    { id: "niedrig", label: "Niedrig (300-450 kcal)", min: 300, max: 450 },
    { id: "mittel", label: "Mittel (451-600 kcal)", min: 451, max: 600 },
    { id: "hoch", label: "Hoch (601-750 kcal)", min: 601, max: 750 },
    {
      id: "sehr-hoch",
      label: "Sehr hoch (> 750 kcal)",
      min: 751,
      max: Infinity,
    },
  ];

  // Filter recipes based on search term and filter selections
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.ingredients &&
          recipe.ingredients.some((ing) =>
            ing.name.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategory =
        !filterCategory ||
        (recipe.categories && recipe.categories.includes(filterCategory));
      const matchesDifficulty =
        !filterDifficulty || recipe.difficulty === filterDifficulty;
      const matchesPrice = !filterPrice || recipe.price === filterPrice;
      const matchesTaste = !filterTaste || recipe.taste === filterTaste;

      // Überprüfe, ob das Rezept in den ausgewählten Kalorienbereich fällt
      let matchesCalories = true;
      if (filterCalories) {
        const selectedRange = calorieRanges.find(
          (range) => range.id === filterCalories
        );
        if (selectedRange) {
          const calories = recipe.calories || 0;
          matchesCalories =
            calories >= selectedRange.min && calories <= selectedRange.max;
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesPrice &&
        matchesTaste &&
        matchesCalories
      );
    });
  }, [
    recipes,
    searchTerm,
    filterCategory,
    filterDifficulty,
    filterPrice,
    filterTaste,
    filterCalories,
  ]);

  // Sortiere die gefilterten Rezepte alphabetisch nach Namen
  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredRecipes]);

  // Funktion zum Rendern der Kartenansicht
  const renderCardView = () => (
    <div className="recipe-list">
      {sortedRecipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="recipe-card-img"
            />
          )}
          <div className="recipe-card-body">
            <h3 className="recipe-card-title">{recipe.name}</h3>
            <p>{recipe.description}</p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <span>{recipe.prepTime + recipe.cookTime} Min.</span>
              <span>{recipe.calories} kcal</span>
            </div>

            <div className="recipe-tags">
              {recipe.categories &&
                recipe.categories.map((category) => (
                  <span key={category} className="recipe-tag">
                    {category}
                  </span>
                ))}
              <span className="recipe-tag">{recipe.difficulty}</span>
              <span className="recipe-tag">{recipe.price}</span>
              <span className="recipe-tag">{recipe.taste}</span>
            </div>

            <div style={{ marginTop: "15px" }}>
              <Link
                to={`/recipe/${recipe.id}`}
                className="btn"
                style={{ width: "100%" }}
              >
                Ansehen
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Funktion zum Rendern der Tabellenansicht mit separaten Spalten für Preis, Kalorien und Schwierigkeit
  const renderTableView = () => (
    <div className="recipe-table-container">
      <table className="recipe-table">
        <thead>
          <tr>
            <th className="col-name">Rezept</th>
            <th className="col-categories">Kategorien</th>
            <th className="col-time">Zeit</th>
            <th className="col-calories">Kalorien</th>
            <th className="col-difficulty">Schwierigkeit</th>
            <th className="col-price">Preis</th>
            <th className="col-actions">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecipes.map((recipe) => (
            <tr key={recipe.id}>
              {/* Rezeptname und Bild */}
              <td className="col-name">
                <div className="recipe-name-cell">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="recipe-table-img"
                    />
                  )}
                  <span>{recipe.name}</span>
                </div>
              </td>

              {/* Kategorien */}
              <td className="col-categories">
                <div className="detail-tags">
                  {recipe.categories &&
                    recipe.categories.map((category) => (
                      <span key={category} className="recipe-tag">
                        {category}
                      </span>
                    ))}
                </div>
              </td>

              {/* Zubereitungszeit */}
              <td className="col-time">
                {recipe.prepTime + recipe.cookTime} Min.
              </td>

              {/* Kalorien */}
              <td className="col-calories">{recipe.calories} kcal</td>

              {/* Schwierigkeit */}
              <td className="col-difficulty">
                <span className="recipe-tag">{recipe.difficulty}</span>
              </td>

              {/* Preis */}
              <td className="col-price">
                <span className="recipe-tag">{recipe.price}</span>
              </td>

              {/* Aktionen - Icons nebeneinander */}
              <td className="col-actions">
                <div className="recipe-actions-cell">
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="btn-icon view-icon"
                    title="Ansehen"
                    aria-label="Rezept ansehen"
                  >
                    <span className="sr-only">Ansehen</span>
                  </Link>
                  <Link
                    to={`/edit/${recipe.id}`}
                    className="btn-icon edit-icon"
                    title="Bearbeiten"
                    aria-label="Rezept bearbeiten"
                  >
                    <span className="sr-only">Bearbeiten</span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2>Alle Rezepte</h2>
          <button onClick={exportRecipesJson} className="btn btn-success">
            Exportiere alle Rezepte als JSON
          </button>
        </div>

        {/* Toggle-Buttons für die Ansicht */}
        <div className="view-toggle" style={{ display: "flex", gap: "10px" }}>
          <button
            className={`btn ${viewMode === "cards" ? "" : "btn-secondary"}`}
            onClick={() => setViewMode("cards")}
            title="Kartenansicht"
          >
            <span className="cards-icon"></span>
            <span className="toggle-text">Kartenansicht</span>
          </button>
          <button
            className={`btn ${viewMode === "table" ? "" : "btn-secondary"}`}
            onClick={() => setViewMode("table")}
            title="Tabellenansicht"
          >
            <span className="table-icon"></span>
            <span className="toggle-text">Tabellenansicht</span>
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Suche nach Rezepten oder Zutaten"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ minWidth: "200px" }}>
            <label>Kategorie</label>
            <select
              className="form-control"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Alle Kategorien</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: "200px" }}>
            <label>Schwierigkeit</label>
            <select
              className="form-control"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="">Alle Schwierigkeitsgrade</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: "200px" }}>
            <label>Preis</label>
            <select
              className="form-control"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
            >
              <option value="">Alle Preise</option>
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: "200px" }}>
            <label>Geschmack</label>
            <select
              className="form-control"
              value={filterTaste}
              onChange={(e) => setFilterTaste(e.target.value)}
            >
              <option value="">Alle Geschmacksrichtungen</option>
              {tastes.map((taste) => (
                <option key={taste} value={taste}>
                  {taste}
                </option>
              ))}
            </select>
          </div>

          {/* Neuer Filter für Kalorien */}
          <div style={{ minWidth: "200px" }}>
            <label>Kalorien</label>
            <select
              className="form-control"
              value={filterCalories}
              onChange={(e) => setFilterCalories(e.target.value)}
            >
              <option value="">Alle Kalorienbereiche</option>
              {calorieRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Anzeige von gefilterten Rezepten oder Meldung, wenn keine gefunden wurden */}
      {sortedRecipes.length === 0 ? (
        <p>
          Keine Rezepte gefunden. Versuche andere Suchkriterien oder{" "}
          <Link to="/add">füge ein neues Rezept hinzu</Link>.
        </p>
      ) : (
        <>
          <p style={{ marginBottom: "20px" }}>
            {sortedRecipes.length}{" "}
            {sortedRecipes.length === 1 ? "Rezept" : "Rezepte"} gefunden.
          </p>

          {/* Wechsel zwischen Karten- und Tabellenansicht */}
          {viewMode === "cards" ? renderCardView() : renderTableView()}
        </>
      )}
    </div>
  );
};

export default Home;
