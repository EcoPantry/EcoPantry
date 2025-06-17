from rapidfuzz import process
import json

# Load Clark environmental scores
with open("env_scores.json", "r") as f:
    scores = json.load(f)

# Load products 
with open("final.json", "r") as f:
    products = json.load(f)

ingredient_keys = list(scores.keys())

def fuzzy_match_ingredient(name, ingredient_list, cutoff=75):
    match, score, _ = process.extractOne(name.lower(), ingredient_list)
    return match if score >= cutoff else None

# Example FairPrice product
# product = {
#     "name": "Sunshine Hokkaido Milk Toast Bread",
#     "category": "breads"
# }

def main():
    for productId, product in products.items():
        print(f"Processing product: {product['name']}")
        ingredient = fuzzy_match_ingredient(product["name"], ingredient_keys)

        if ingredient:
            print(f"Matched to ingredient: {ingredient}")
            print("Environmental Score:", scores[ingredient])
            products[productId]["environmental_ing_map"] = ingredient
            products[productId]["environmental_score"] = scores[ingredient]
        else:
            print("No match found")
            products[productId]["environmental_score"] = None

    with open("final_with_scores.json", "w") as f:
        json.dump(products, f, indent=4)

if __name__ == "__main__":
    main()