/**
 * Shared helpers for handling the hierarchical category tree returned by the
 * backend's /category/show endpoint.
 *
 * The tree may contain a synthetic "Home" root container that wraps all real
 * categories. These helpers transparently unwrap it.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const getCategoryName = (category) => {
  if (!category) return "";
  if (typeof category.name === "string") return category.name;
  return category.name?.es || category.name?.en || "";
};

const isHomeContainer = (category) =>
  getCategoryName(category).trim().toLowerCase() === "home";

const dedupeById = (categories) => {
  const seen = new Set();
  return categories.filter((cat) => {
    const id = String(cat?._id || "");
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Unwrap the "Home" container (if present) and return top-level visible categories.
 * Used by navbar, feature grid, and carousel components.
 */
const getMenuCategories = (categories = []) => {
  const source = Array.isArray(categories) ? categories : [];
  const unwrapped = [];

  for (const category of source) {
    if (!category) continue;

    if (isHomeContainer(category) && Array.isArray(category.children)) {
      unwrapped.push(...category.children);
    } else {
      unwrapped.push(category);
    }
  }

  return dedupeById(unwrapped).filter((cat) => cat?.status === "show");
};

/**
 * Recursively flatten the category tree into a single array.
 * Skips the "Home" container, keeps all visible descendants.
 * Used by SearchScreen to resolve brand options per category.
 */
const flattenCategories = (categories = []) => {
  const source = Array.isArray(categories) ? categories : [];
  const result = [];

  const visit = (category) => {
    if (!category) return;

    if (!isHomeContainer(category) && category?.status === "show") {
      result.push(category);
    }

    if (Array.isArray(category.children)) {
      category.children.forEach(visit);
    }
  };

  source.forEach(visit);
  return dedupeById(result);
};

export { flattenCategories, getMenuCategories };
