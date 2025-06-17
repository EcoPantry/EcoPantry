import json
import re
from pprint import pprint

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
   
    print(steps)  
    return steps


def main():
    with open("recipe_details.json", "r", encoding="utf-8") as f:
        recipes = json.load(f)

    processedRecipes = []
    categories = set()
    areas = set()

    c = 0
    maxC = 1
    for recipe in recipes:
        if c == maxC:
            break

        pprint(recipe)

        category = recipe.get("category", "")
        area = recipe.get("area", "")
        instructionsParsed = parseInstructions(recipe.get("instructions", ""))

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
            "ingredients": [], # Placeholder
        })

        c += 1

    print(len(processedRecipes))

    res = {}
    res["categories"] = sorted(categories)
    res["areas"] = sorted(areas)
    res["recipes"] = processedRecipes

    with open("recipe_details_processed.json", "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()