import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import MealPlanner from "./pages/MealPlanner";
import ShoppingList from "./pages/ShoppingList";

function App() {
  return (
    <RecipeProvider>
      <div className="app">
        <header className="header">
          <div className="container">
            <h1>Rezepte App</h1>
            <nav>
              <ul className="nav">
                <li>
                  <Link to="/">Rezepte</Link>
                </li>
                <li>
                  <Link to="/add">Neues Rezept</Link>
                </li>
                <li>
                  <Link to="/meal-planner">Essensplaner</Link>
                </li>
                <li>
                  <Link to="/shopping-list">Einkaufsliste</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container" style={{ padding: "20px 0" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </main>
        <footer
          className="footer"
          style={{
            textAlign: "center",
            padding: "20px",
            borderTop: "1px solid #eee",
          }}
        >
          <div className="container">
            <p>&copy; 2025 Rezepte App - Alle Rezepte an einem Ort</p>
          </div>
        </footer>
      </div>
    </RecipeProvider>
  );
}

export default App;
