import json
import re
from pprint import pprint
from ingredient_parser import parse_ingredient

def parseInstructions(rawText):
    if not rawText:
        return []

    rawText = rawText.strip()
    cleaned = re.sub(r'\r\n', '\n', rawText)
    cleaned = re.sub(r'\n+', '\n', cleaned)  # Remove multiple newlines

    lines = cleaned.strip().split('\n')
    steps = []
    for line in lines:
        line = line.strip()
        line = re.sub(r'^\d+\s*', '', line)      # remove leading numbers like "1 "
        line = re.sub(r'^\.\s*', '', line)       # remove leading dot like ". Mix flour"
        if line:
            steps.append(line)
   
    return steps

def parseIngredients(rawIngredientsList):
    if not rawIngredientsList:
        return []

    ingredients = []
    for ingredient in rawIngredientsList:
        parsed = parse_ingredient(ingredient)
        ingDetails = {}
        # print(parsed.name)
        # print(parsed.amount)
        if parsed.name:
            ingName = parsed.name[0].text
            ingDetails["name"] = ingName
        
        if parsed.amount:
            if parsed.amount[0].quantity:
                ingAmt = str(parsed.amount[0].quantity)
            else:
                ingAmt = None

            if parsed.amount[0].unit:
                ingUnit = str(parsed.amount[0].unit)
            else:
                ingUnit = None
            
            
            ingDetails["amount"] = {
                "quantity": ingAmt,
                "unit": ingUnit,
            }

        print(ingDetails)
        ingredients.append(ingDetails) 
            
    # for ing in ingredients:
    #     print(f"ingredient: {ing.name}, amt: {ing.amount}")
    return ingredients

def main():
    with open("recipe_details.json", "r", encoding="utf-8") as f:
        recipes = json.load(f)

    processedRecipes = []
    categories = set()
    areas = set()

    for recipe in recipes:
        category = recipe.get("category", "")
        area = recipe.get("area", "")
        instructionsParsed = parseInstructions(recipe.get("instructions", ""))
        ingredientsParsed = parseIngredients(recipe.get("ingredients", []))

        categories.add(category)
        areas.add(area)

        processedRecipes.append({
            "id": recipe.get("id"),
            "name": recipe.get("name"),
            "category": recipe.get("category"),
            "area": recipe.get("area"),
            "youtube": recipe.get("youtube", ""),
            "thumbnail": recipe.get("thumbnail", ""),
            "instructions": instructionsParsed,
            "ingredients": ingredientsParsed
        })

    print(len(processedRecipes))

    res = {}
    res["categories"] = sorted(categories)
    res["areas"] = sorted(areas)
    res["recipes"] = processedRecipes

    with open("recipe_details_processed.json", "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()