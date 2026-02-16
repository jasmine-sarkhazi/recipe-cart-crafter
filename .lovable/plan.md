

# Mobile-Friendly Redesign

## Current Issues

The app has several areas that break or become unusable on small screens:

1. **Navbar**: All 6 navigation links plus user info are in a single horizontal row -- they overflow and get cut off on mobile
2. **Meal Plan**: The 7-column day grid is far too wide for mobile screens
3. **Shopping Item**: Each item has checkbox + name + quantity input + unit select + store select + delete button all in one row -- overflows on mobile
4. **Ingredient Bank**: Header buttons ("Take Photo" / "Upload") can wrap awkwardly

## Plan

### 1. Navbar -- Mobile Bottom Tab Bar

Replace the top horizontal nav links with a **bottom tab bar** on mobile (visible only below 768px). The top bar on mobile will show only the logo and user avatar/sign-out. The bottom bar will show icon-only tabs for: Today, Recipes, Ingredients, Plan, Find, List.

On desktop, everything stays as-is.

### 2. Meal Plan -- Vertical Stack on Mobile

Change the 7-column grid to a single-column stacked layout on mobile. Each day becomes a full-width card. The week navigation header will also stack better with smaller text.

### 3. Shopping Item -- Responsive Layout

Reorganize the shopping item component so that on mobile, the quantity/unit/store controls wrap to a second line beneath the item name, instead of all being in one long row.

### 4. Ingredient Bank -- Responsive Header

Stack the "Take Photo" and "Upload" buttons below the heading on small screens instead of beside it.

---

## Technical Details

**Files to modify:**

- `src/components/Navbar.tsx` -- Add a mobile bottom tab bar using fixed positioning, hide desktop nav links on small screens, show them in the bottom bar instead
- `src/pages/MealPlan.tsx` -- Change grid from `md:grid-cols-7` to single column on mobile with a more compact card layout
- `src/components/ShoppingItem.tsx` -- Use `flex-wrap` or a two-row layout so controls don't overflow
- `src/pages/IngredientBank.tsx` -- Make header flex-wrap so buttons go below the title on mobile
- `src/index.css` -- Add bottom padding to body/main content to account for the bottom nav bar on mobile
- `src/pages/Index.tsx` -- Add bottom padding for the mobile nav bar

No new dependencies are needed. All changes use existing Tailwind responsive utilities (`sm:`, `md:`, `lg:`) and the existing `useIsMobile` hook if needed.

