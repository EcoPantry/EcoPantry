import ReactMarkdown from "react-markdown";

const mockRecipe = {
  id: "",
  title: "Poke Salad Bowl",
  imageUrl: "../images/poke-bowl.png",
  ingredients: [
    "2 duck breasts, skin on",
    "Salt and freshly cracked pepper",

    "1 cup pitted cherries (fresh or frozen)",
    "2 tbsp sugar",
    "1/4 cup red wine vinegar",
    "1/4 cup chicken or duck stock",
    "1 tsp minced shallots",
    "1 tsp butter",

    "3 large Yukon Gold potatoes",
    "3 tbsp clarified butter",
    "Salt to taste",
    "Fresh thyme (optional)",

    "12 asparagus spears, trimmed",
    "1 tbsp olive oil",
    "Salt and pepper",
    "Zest of 1/2 lemon (optional)",
  ],
  instructions: [
    "Preheat oven to 200°C (400°F).",
    "Peel and thinly slice the potatoes using a mandoline.",
    "Brush a skillet with clarified butter and layer potato slices in a rosette pattern, brushing each layer with butter and sprinkling with salt and thyme.",
    "Press down with foil and a weight, bake for 30 minutes, remove weight, bake another 15–20 minutes until crispy.",
    "Let rest and invert to unmold.",

    "Preheat sous vide water bath to 85°C (185°F).",
    "Place asparagus in a bag with olive oil, salt, and lemon zest. Vacuum seal.",
    "Cook in the water bath for 10–12 minutes.",
    "Remove and pat dry. Optionally sear or torch for color.",

    "Score duck skin in a crosshatch pattern, avoid cutting into flesh.",
    "Season both sides with salt and pepper.",
    "Place skin-side down in a cold pan, render fat on medium heat for 6–8 minutes.",
    "Flip and cook flesh side for 3–4 minutes. Rest for 5–10 minutes, then slice thinly.",

    "In a saucepan, melt sugar until light amber caramel forms.",
    "Carefully add vinegar, then shallots. Reduce slightly.",
    "Add cherries and stock, simmer for 10 minutes until reduced by half.",
    "Finish with butter and blend if smoother texture is desired.",

    "Slice duck and fan over Pommes Anna. Drizzle cherry gastrique over duck.",
    "Serve with sous vide asparagus on the side.",
  ],
};

const mockFeedback = {
  difficulty: 3,
  justification:
    "Poke Salad Bowl is a moderately complex recipe requiring some knife skills (skinning duck), sous vide cooking (which requires a bit of understanding of water bath temperatures), and a few steps involving caramelizing sugar. It’s achievable for a home cook with some practice, but it’s not a simple, straightforward dish.",
  "mini-glossary": [
    "**Sous Vide:** A cooking method where food is sealed in a bag and submerged in a temperature-controlled water bath, allowing for precise and even cooking.",
    "**Caramelization:** The process of cooking sugar to produce a brown, flavorful crust.",
    "**Pommes Anna:** A French term for a simple, rustic salad – often featuring boiled potatoes and a vinaigrette.",
    "**Gastrique:** A sweet and sour sauce, typically made with vinegar, sugar, and often wine or fruit.",
    "**Mandoline:** A vegetable slicer with a blade that allows for incredibly thin, even slices.",
  ],
};

const getDifficultyLabel = (level: number) => {
  switch (level) {
    case 1:
      return "Beginner";
    case 2:
      return "Easy";
    case 3:
      return "Intermediate";
    case 4:
      return "Advanced";
    case 5:
      return "Expert";
    default:
      return "Unknown";
  }
};

const getDifficultyColor = (level: number) => {
  switch (level) {
    case 1:
      return "bg-green-200 text-green-800";
    case 2:
      return "bg-lime-200 text-lime-800";
    case 3:
      return "bg-yellow-200 text-yellow-800";
    case 4:
      return "bg-orange-200 text-orange-800";
    case 5:
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const RecipePage = () => {
  // In a real app, fetch recipe by ID from params
  // const { recipeId } = useParams();
  const recipe = mockRecipe;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className="w-full h-52 object-cover"
      />
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc pl-6 space-y-1">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <div className="bg-gradient-to-br from-green-100 via-purple-50 to-pink-100 rounded-xl p-6 shadow-sm border border-white/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            Sage's Difficulty Assessment
          </h2>

          <div className="space-y-4">
            {/* Difficulty Level */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                Difficulty Level:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                  mockFeedback.difficulty
                )}`}
              >
                {getDifficultyLabel(mockFeedback.difficulty)} (
                {mockFeedback.difficulty}/5)
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                Why this rating?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {mockFeedback.justification}
              </p>
            </div>
            {mockFeedback["mini-glossary"] &&
              mockFeedback["mini-glossary"].length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    🔍 Cooking Terms
                  </h3>
                  <div className="bg-white/40 rounded-lg p-3">
                    <ul className="space-y-1 text-sm">
                      {mockFeedback["mini-glossary"].map((term, index) => (
                        <li key={index} className="text-gray-700">
                          <ReactMarkdown>{term}</ReactMarkdown>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default RecipePage;
