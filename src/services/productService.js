import { mapProductsPageResponse } from "@/app/products/lib/productsMapper";

const PRODUCTS_PAGE_RESPONSE = {
  hero: {
    eyebrow: "ULTIMA PRODUCTS",
    title: "Choose Your Learning Product",
    subtitle:
      "Explore books, exam preparation packs, and future learning formats through one modular product system.",
  },
  sections: [
    {
      id: "books",
      title: "Books",
      subtitle: "Study resources for school and exam preparation.",
      products: [
        {
          id: "ncert-physics",
          slug: "ncert-physics",
          category: "books",
          type: "book",
          title: "NCERT Physics",
          price: "₹299",
          oldPrice: "₹399",
          features: [
            "Concept-focused chapters",
            "Solved examples",
            "Practice questions",
          ],
          isPopular: true,
          badgeText: "🔥 Popular",
        },
        {
          id: "ncert-chemistry",
          slug: "ncert-chemistry",
          category: "books",
          type: "book",
          title: "NCERT Chemistry",
          price: "₹279",
          oldPrice: "₹379",
          features: [
            "Chapter-wise learning",
            "Reaction-focused practice",
            "Exam-ready revision",
          ],
          isPopular: false,
          badgeText: "",
        },
        {
          id: "ncert-maths",
          slug: "ncert-maths",
          category: "books",
          type: "book",
          title: "NCERT Maths",
          price: "₹249",
          oldPrice: "₹349",
          features: [
            "Step-by-step methods",
            "Topic-wise exercises",
            "Board-oriented practice",
          ],
          isPopular: false,
          badgeText: "",
        },
        {
          id: "ncert-biology",
          slug: "ncert-biology",
          category: "books",
          type: "book",
          title: "NCERT Biology",
          price: "₹289",
          oldPrice: "₹389",
          features: [
            "Diagram-rich explanations",
            "NCERT aligned content",
            "Quick revision support",
          ],
          isPopular: false,
          badgeText: "",
        },
      ],
    },
    {
      id: "competitive-preparation",
      title: "Competitive Exam Preparation",
      subtitle: "Targeted preparation packs for high-stakes exams.",
      products: [
        {
          id: "jee-preparation",
          slug: "jee-preparation",
          category: "competitive",
          type: "exam-pack",
          title: "JEE Preparation",
          price: "₹999",
          oldPrice: "₹1499",
          features: [
            "Advanced practice sets",
            "Mock tests",
            "Rank-oriented preparation",
          ],
          isPopular: true,
          badgeText: "🔥 Most Popular",
        },
        {
          id: "neet-preparation",
          slug: "neet-preparation",
          category: "competitive",
          type: "exam-pack",
          title: "NEET Preparation",
          price: "₹999",
          oldPrice: "₹1499",
          features: [
            "Biology-first structured prep",
            "Mock simulations",
            "Weak-area analysis",
          ],
          isPopular: true,
          badgeText: "🔥 Trending",
        },
        {
          id: "gate-preparation",
          slug: "gate-preparation",
          category: "competitive",
          type: "exam-pack",
          title: "GATE Preparation",
          price: "₹1199",
          oldPrice: "₹1699",
          features: [
            "Subject-wise preparation",
            "Concept reinforcement",
            "Exam-style practice",
          ],
          isPopular: false,
          badgeText: "",
        },
      ],
    },
  ],
};

export async function getProductsPageData() {
  return mapProductsPageResponse(PRODUCTS_PAGE_RESPONSE);
}