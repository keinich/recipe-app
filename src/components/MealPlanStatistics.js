import React, { useContext, useMemo } from "react";
import { RecipeContext } from "../context/RecipeContext";

const MealPlanStatistics = () => {
  const { recipes, mealPlan } = useContext(RecipeContext);

  // Berechne Statistiken basierend auf den ausgewählten Rezepten im Essensplan
  const statistics = useMemo(() => {
    // Sammle alle Rezepte aus dem Essensplan
    const allRecipeIds = Object.values(mealPlan).flat();

    // Wenn keine Rezepte im Plan sind, gib leere Statistiken zurück
    if (allRecipeIds.length === 0) {
      return {
        totalRecipes: 0,
        totalCalories: 0,
        averageCalories: 0,
        totalPrepTime: 0,
        totalCookTime: 0,
        averagePrepTime: 0,
        averageCookTime: 0,
        priceDistribution: {},
        difficultyDistribution: {},
        tasteDistribution: {},
        categoryDistribution: {},
        mostExpensiveRecipe: null,
        mostTimeConsumingRecipe: null,
        highestCalorieRecipe: null,
        easiestRecipe: null,
      };
    }

    // Hole alle Rezepte aus dem Essensplan
    const plannedRecipes = allRecipeIds
      .map((id) => recipes.find((r) => r.id === id))
      .filter(Boolean);

    // Berechne die Gesamtkalorien
    const totalCalories = plannedRecipes.reduce(
      (sum, recipe) => sum + (recipe.calories || 0) * (recipe.servings || 1),
      0
    );

    // Berechne die durchschnittlichen Kalorien pro Rezept
    const averageCalories = Math.round(totalCalories / plannedRecipes.length);

    // Berechne die gesamte Vorbereitungszeit
    const totalPrepTime = plannedRecipes.reduce(
      (sum, recipe) => sum + (recipe.prepTime || 0),
      0
    );

    // Berechne die durchschnittliche Vorbereitungszeit pro Rezept
    const averagePrepTime = Math.round(totalPrepTime / plannedRecipes.length);

    // Berechne die gesamte Kochzeit
    const totalCookTime = plannedRecipes.reduce(
      (sum, recipe) => sum + (recipe.cookTime || 0),
      0
    );

    // Berechne die durchschnittliche Kochzeit pro Rezept
    const averageCookTime = Math.round(totalCookTime / plannedRecipes.length);

    // Erstelle eine Verteilung der Preiskategorien
    const priceDistribution = plannedRecipes.reduce((dist, recipe) => {
      const price = recipe.price || "Keine Angabe";
      dist[price] = (dist[price] || 0) + 1;
      return dist;
    }, {});

    // Erstelle eine Verteilung der Schwierigkeitsgrade
    const difficultyDistribution = plannedRecipes.reduce((dist, recipe) => {
      const difficulty = recipe.difficulty || "Keine Angabe";
      dist[difficulty] = (dist[difficulty] || 0) + 1;
      return dist;
    }, {});

    // Erstelle eine Verteilung der Geschmacksrichtungen
    const tasteDistribution = plannedRecipes.reduce((dist, recipe) => {
      const taste = recipe.taste || "Keine Angabe";
      dist[taste] = (dist[taste] || 0) + 1;
      return dist;
    }, {});

    // Erstelle eine Verteilung der Kategorien
    const categoryDistribution = {};
    plannedRecipes.forEach((recipe) => {
      if (recipe.categories && recipe.categories.length) {
        recipe.categories.forEach((category) => {
          categoryDistribution[category] =
            (categoryDistribution[category] || 0) + 1;
        });
      }
    });

    // Finde das teuerste Rezept
    const mostExpensiveRecipe = [...plannedRecipes].sort((a, b) => {
      const priceOrder = {
        "Sehr günstig": 1,
        Günstig: 2,
        Mittel: 3,
        Gehoben: 4,
      };
      return (priceOrder[b.price] || 0) - (priceOrder[a.price] || 0);
    })[0];

    // Finde das zeitaufwändigste Rezept
    const mostTimeConsumingRecipe = [...plannedRecipes].sort(
      (a, b) => b.prepTime + b.cookTime - (a.prepTime + a.cookTime)
    )[0];

    // Finde das Rezept mit den meisten Kalorien
    const highestCalorieRecipe = [...plannedRecipes].sort(
      (a, b) => (b.calories || 0) - (a.calories || 0)
    )[0];

    // Finde das einfachste Rezept
    const easiestRecipe = [...plannedRecipes].sort((a, b) => {
      const difficultyOrder = { Einfach: 1, Mittel: 2, Schwer: 3 };
      return (
        (difficultyOrder[a.difficulty] || 0) -
        (difficultyOrder[b.difficulty] || 0)
      );
    })[0];

    return {
      totalRecipes: plannedRecipes.length,
      totalCalories,
      averageCalories,
      totalPrepTime,
      totalCookTime,
      averagePrepTime,
      averageCookTime,
      priceDistribution,
      difficultyDistribution,
      tasteDistribution,
      categoryDistribution,
      mostExpensiveRecipe,
      mostTimeConsumingRecipe,
      highestCalorieRecipe,
      easiestRecipe,
    };
  }, [recipes, mealPlan]);

  // Formatierung für Zeit (Minuten in Stunden und Minuten umwandeln)
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} Min.`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} Std. ${remainingMinutes} Min.`;
  };

  // Ermittle die häufigste Preiskategorie
  const mostCommonPrice =
    Object.entries(statistics.priceDistribution).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "Keine Daten";

  // Ermittle die häufigste Schwierigkeit
  const mostCommonDifficulty =
    Object.entries(statistics.difficultyDistribution).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "Keine Daten";

  // Ermittle die häufigste Geschmacksrichtung
  const mostCommonTaste =
    Object.entries(statistics.tasteDistribution).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "Keine Daten";

  // Ermittle die Top-3 Kategorien
  const topCategories = Object.entries(statistics.categoryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  // Wenn keine Rezepte vorhanden sind, zeige eine entsprechende Nachricht
  if (statistics.totalRecipes === 0) {
    return (
      <div className="card" style={{ marginBottom: "20px", padding: "15px" }}>
        <h3>Mahlzeitenübersicht</h3>
        <p>
          Keine Rezepte im Essensplan. Füge Rezepte hinzu, um Statistiken zu
          sehen.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: "20px", padding: "15px" }}>
      <h3>Mahlzeitenübersicht</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "5px" }}>Allgemein</h4>
          <p>
            <strong>Rezepte insgesamt:</strong> {statistics.totalRecipes}
          </p>
          <p>
            <strong>Gesamtkalorien:</strong>{" "}
            {statistics.totalCalories.toLocaleString()} kcal
          </p>
          <p>
            <strong>Ø Kalorien pro Rezept:</strong>{" "}
            {statistics.averageCalories.toLocaleString()} kcal
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "5px" }}>Zeitaufwand</h4>
          <p>
            <strong>Vorbereitungszeit gesamt:</strong>{" "}
            {formatTime(statistics.totalPrepTime)}
          </p>
          <p>
            <strong>Kochzeit gesamt:</strong>{" "}
            {formatTime(statistics.totalCookTime)}
          </p>
          <p>
            <strong>Gesamtzeit:</strong>{" "}
            {formatTime(statistics.totalPrepTime + statistics.totalCookTime)}
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "5px" }}>
            Durchschnitt pro Rezept
          </h4>
          <p>
            <strong>Ø Vorbereitungszeit:</strong>{" "}
            {formatTime(statistics.averagePrepTime)}
          </p>
          <p>
            <strong>Ø Kochzeit:</strong>{" "}
            {formatTime(statistics.averageCookTime)}
          </p>
          <p>
            <strong>Ø Gesamtzeit:</strong>{" "}
            {formatTime(
              statistics.averagePrepTime + statistics.averageCookTime
            )}
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: "16px", marginBottom: "5px" }}>
            Kategorisierung
          </h4>
          <p>
            <strong>Häufigste Preiskategorie:</strong> {mostCommonPrice}
          </p>
          <p>
            <strong>Häufigster Schwierigkeitsgrad:</strong>{" "}
            {mostCommonDifficulty}
          </p>
          <p>
            <strong>Häufigster Geschmack:</strong> {mostCommonTaste}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "16px", marginBottom: "5px" }}>
          Top-Kategorien
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {topCategories.map((category) => (
            <span key={category} className="recipe-tag">
              {category}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ fontSize: "16px", marginBottom: "5px" }}>
          Besondere Rezepte
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "10px",
          }}
        >
          {statistics.mostExpensiveRecipe && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              <strong>Teuerstes Rezept:</strong>{" "}
              {statistics.mostExpensiveRecipe.name} (
              {statistics.mostExpensiveRecipe.price})
            </div>
          )}

          {statistics.mostTimeConsumingRecipe && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              <strong>Zeitaufwändigstes Rezept:</strong>{" "}
              {statistics.mostTimeConsumingRecipe.name} (
              {formatTime(
                statistics.mostTimeConsumingRecipe.prepTime +
                  statistics.mostTimeConsumingRecipe.cookTime
              )}
              )
            </div>
          )}

          {statistics.highestCalorieRecipe && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              <strong>Kalorienreichstes Rezept:</strong>{" "}
              {statistics.highestCalorieRecipe.name} (
              {statistics.highestCalorieRecipe.calories} kcal)
            </div>
          )}

          {statistics.easiestRecipe && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              <strong>Einfachstes Rezept:</strong>{" "}
              {statistics.easiestRecipe.name} (
              {statistics.easiestRecipe.difficulty})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanStatistics;
