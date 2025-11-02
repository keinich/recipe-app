import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";

const ShoppingList = () => {
  // Export shopping list as text grouped by category
  const exportAsText = () => {
    let text = "Einkaufsliste";
    Object.keys(itemsByCategory).forEach((category) => {
      const filteredItems = getFilteredItems(itemsByCategory[category]);
      if (filteredItems.length === 0) return;
      text += `\n\n${category}:`;
      filteredItems.forEach((item) => {
        text += `\n- ${item.name}${
          item.amount ? ` (${item.amount} ${item.unit || ""})` : ""
        }`;
      });
    });
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Text wurde in die Zwischenablage kopiert!");
      });
    } else {
      alert(text); // fallback: show text for manual copy
    }
  };
  const {
    shoppingList,
    toggleShoppingItem,
    clearShoppingList,
    generateShoppingList,
  } = useContext(RecipeContext);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'completed'

  // Group items by category
  const itemsByCategory = {};

  shoppingList.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Filter items based on filter state
  const getFilteredItems = (items) => {
    if (filter === "pending") {
      return items.filter((item) => !item.checked);
    } else if (filter === "completed") {
      return items.filter((item) => item.checked);
    }
    return items;
  };

  // Handle printing the shopping list
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h2>Einkaufsliste</h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
          >
            <option value="all">Alle Einträge</option>
            <option value="pending">Noch zu kaufen</option>
            <option value="completed">Bereits gekauft</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {shoppingList.length > 0 && (
            <>
              <button onClick={handlePrint} className="btn">
                Drucken
              </button>
              <button onClick={clearShoppingList} className="btn btn-secondary">
                Liste leeren
              </button>
              <button onClick={exportAsText} className="btn btn-success">
                Export als Text
              </button>
            </>
          )}
          <button onClick={generateShoppingList} className="btn">
            Liste aktualisieren
          </button>
        </div>
      </div>

      {shoppingList.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "20px" }}>
          <p>Deine Einkaufsliste ist leer.</p>
          <p>
            Füge Rezepte zu deinem Essensplan hinzu und generiere eine
            Einkaufsliste.
          </p>
          <Link
            to="/meal-planner"
            className="btn"
            style={{ marginTop: "10px" }}
          >
            Zum Essensplan
          </Link>
        </div>
      ) : (
        <div className="shopping-list">
          {/* Zusammenfassung der Einkaufsliste */}
          <div
            className="card"
            style={{ marginBottom: "20px", padding: "15px" }}
          >
            <h3>Einkaufslisten-Übersicht</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <p>
                  <strong>Gesamtzahl der Artikel:</strong> {shoppingList.length}
                </p>
                <p>
                  <strong>Bereits gekauft:</strong>{" "}
                  {shoppingList.filter((item) => item.checked).length} Artikel
                </p>
                <p>
                  <strong>Noch zu kaufen:</strong>{" "}
                  {shoppingList.filter((item) => !item.checked).length} Artikel
                </p>
              </div>
              <div>
                <p>
                  <strong>Anzahl Kategorien:</strong>{" "}
                  {Object.keys(itemsByCategory).length}
                </p>
                <p>
                  <strong>Artikel pro Kategorie:</strong>{" "}
                  {Math.round(
                    shoppingList.length / Object.keys(itemsByCategory).length
                  )}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <p>
                <strong>Kategorien:</strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {Object.keys(itemsByCategory).map((category) => (
                  <span key={category} className="recipe-tag">
                    {category} ({itemsByCategory[category].length})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Eigentliche Einkaufsliste */}
          {Object.keys(itemsByCategory).map((category) => {
            const filteredItems = getFilteredItems(itemsByCategory[category]);

            if (filteredItems.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "5px",
                  }}
                >
                  {category}
                </h3>

                {filteredItems.map((item, index) => {
                  const itemIndex = shoppingList.findIndex(
                    (i) =>
                      i.name === item.name &&
                      i.unit === item.unit &&
                      i.amount === item.amount
                  );

                  return (
                    <div key={index} className="shopping-list-item">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleShoppingItem(itemIndex)}
                        id={`item-${itemIndex}`}
                      />
                      <label
                        htmlFor={`item-${itemIndex}`}
                        style={{
                          textDecoration: item.checked
                            ? "line-through"
                            : "none",
                          color: item.checked ? "#aaa" : "inherit",
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </label>
                      <span>
                        {item.amount && item.amount + " "}
                        {item.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
