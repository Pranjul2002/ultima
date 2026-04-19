import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./endpoints";
import { PREP_PRODUCTS, CLASS_CATALOG, BOOK_CHAPTERS } from "@/app/products/dataa/catalogData";

// ── Products page ─────────────────────────────────────────────────────────────

export async function getProductsPageData(category) {
  try {
    const url = category
      ? `${API_ENDPOINTS.CATALOG.PRODUCTS}?category=${category}`
      : API_ENDPOINTS.CATALOG.PRODUCTS;
    const items = await apiClient(url);
    // If backend returns data, use it; map to the shape the UI expects
    if (Array.isArray(items) && items.length > 0) return items;
  } catch (_) { /* fall through to static data */ }

  // Fallback: use static catalogData.js so the page always works
  const source = category
    ? PREP_PRODUCTS.filter((p) => p.category === category)
    : PREP_PRODUCTS;
  return source;
}

// ── Class books page ──────────────────────────────────────────────────────────

export async function getBooksForClass(classSlug) {
  try {
    const books = await apiClient(API_ENDPOINTS.CATALOG.BOOKS(classSlug));
    if (Array.isArray(books) && books.length > 0) return books;
  } catch (_) {}

  // Fallback
  return CLASS_CATALOG[classSlug]?.books ?? [];
}

// ── Book detail + chapters ────────────────────────────────────────────────────

export async function getChaptersForBook(bookSlug) {
  try {
    const chapters = await apiClient(API_ENDPOINTS.CATALOG.CHAPTERS(bookSlug));
    if (Array.isArray(chapters) && chapters.length > 0) return chapters;
  } catch (_) {}

  // Fallback
  return BOOK_CHAPTERS[bookSlug]?.chapters ?? [];
}

// ── Chapter → Test bridge (THE KEY CONNECTION) ────────────────────────────────

/**
 * Given a chapterId + bookSlug, returns the linked backend testId (if any).
 * The frontend "Take Test" button uses this to navigate to the live test.
 */
export async function getLinkedTestId(bookSlug, chapterId) {
  try {
    const chapter = await apiClient(
      API_ENDPOINTS.CATALOG.CHAPTER(bookSlug, chapterId)
    );
    return chapter?.linkedTestId ?? null;
  } catch (_) {
    return null;
  }
}

// ── Test interaction ──────────────────────────────────────────────────────────

export async function getTestQuestions(testId) {
  return apiClient(API_ENDPOINTS.TESTS.QUESTIONS(testId));
}

export async function submitTest(testId, answers) {
  // answers: [{ questionId: Long, selectedAnswer: "A"|"B"|"C"|"D" }]
  return apiClient(API_ENDPOINTS.TESTS.SUBMIT(testId), {
    method: "POST",
    body: { answers },
  });
}

export async function getMyTestAttempts() {
  return apiClient(API_ENDPOINTS.TESTS.MY_ATTEMPTS);
}
