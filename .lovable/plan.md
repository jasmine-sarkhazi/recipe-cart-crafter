

# 🍳 Recipe & Grocery Shopping App

## Overview
A recipe browsing app with an integrated grocery shopping list. Users can view recipe cards, build shopping lists from ingredients, classify ingredients by specific grocery stores, and set quantities.

---

## Page 1: Home / Recipe Cards
- **Hero section** with app title and a brief tagline
- **Grid of recipe cards** showing:
  - Recipe image (placeholder images)
  - Recipe name
  - Brief description
  - Number of ingredients
  - "Add to Shopping List" button
- **Pre-filled sample recipes** (e.g., Spaghetti Bolognese, Chicken Stir Fry, Caesar Salad, Pancakes) seeded in the database
- Clicking a card opens a **recipe detail view** with full ingredient list and instructions

## Page 2: Shopping List
- **Single entry point** accessible from the navigation bar
- Displays all ingredients added from recipes
- Each ingredient row shows:
  - Ingredient name
  - **Quantity input** (number + unit selector: cups, lbs, oz, pieces, etc.)
  - **Store selector** dropdown (e.g., Costco, Trader Joe's, Walmart, Whole Foods, Aldi — user can also add custom stores)
  - Remove button
- **Grouped view** option: toggle to see ingredients organized by store
- Ability to manually add ingredients (not just from recipes)
- Checkbox to mark items as purchased

## Backend (Supabase / Lovable Cloud)
- **Recipes table**: id, name, description, image_url, instructions
- **Recipe ingredients table**: id, recipe_id, ingredient_name, default_quantity, default_unit
- **Shopping list table**: id, ingredient_name, quantity, unit, store, is_purchased
- **Stores table**: id, name (pre-filled + user-addable)
- Sample recipe data seeded on setup

## Design & UX
- Clean, modern card-based layout
- Responsive grid (mobile-friendly)
- Toast notifications when adding items to the shopping list
- Simple top navigation bar with "Recipes" and "Shopping List" links

