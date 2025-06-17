import json

def main():
    with open('../fairprice-scraper/final.json', 'r', encoding='utf-8') as f:
        productData = json.load(f)

    with open("../recipes-scraper/recipe_details_processed.json", 'r', encoding='utf-8') as f:
        recipeData = json.load(f)


    # Step 0: Exclude certain categories from FairPrice data
    excluded_categories = ["ready-to-eat"]
    productData = {
        cat: items for cat, items in productData.items() if cat not in excluded_categories
    }

    # Step 1: Create ID → Ingredient Name map
    id_to_ingredient = {v: k for k, v in recipeData["ingredients"].items()}

    # Step 3: Match ingredients to related products via substring matching
    ingredient_products = []

    for ingredient_id, ingredient_name in id_to_ingredient.items():
        matches = []
        for product in productData.values():
            if ingredient_name.lower() in product["name"].lower():
                matches.append(product)

        if matches:
            ingredient_products.append({
                "ingredientId": ingredient_id, 
                "ingredient": ingredient_name,
                "matchedProducts": matches
            })

    # Step 4: Output mapping to JSON
    with open('ingredient_to_product_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(ingredient_products, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()