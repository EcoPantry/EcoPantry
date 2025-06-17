from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import random
import time
import requests
from pprint import pprint

def getCategories(baseUrl):
    print("====> Fetching categories...")
    catUrl = f"{baseUrl}categories.php"
    return requests.get(catUrl).json()['categories']

def getCategoryRecipes(baseUrl, catName, catId):
    print(f"====> Fetching recipes for category: {catName} (ID: {catId})")
    catRecipesUrl = f"{baseUrl}filter.php?c={catName}"
    response = requests.get(catRecipesUrl)
    recipes = response.json().get('meals', [])
    return recipes

def getRecipeDetails(baseUrl, recipeId):
    # Preprocessing for each recipe:
        # - ID
        # - strMeal (Name)
        # - strCategory (Category)
        # - strArea (Area)
        # - strYoutube
        # - strThumbnail (Thumbnail URL)
        # - strInstructions (Instructions): To string split by \r\n
        # - Map each ingredient to ingredient ID
        # - Save original ingredient measures, but also convert to grams
        # - strMealThumb (Image URL)
        # - strTags (Tags): To string split by ,

    time.sleep(random.uniform(0.5, 1.2))  # 500–1200 ms delay

    # Fetch and preprocessing done here
    print(f"====> Fetching details for recipe ID: {recipeId}")
    recipeDetailsUrl = f"{baseUrl}lookup.php?i={recipeId}"
    resp = requests.get(recipeDetailsUrl)
    if not resp:
        print(f"No details found for recipe ID: {recipeId}")
        return {}
    recipeDetails = resp.json().get('meals', [])
    if not recipeDetails:
        print(f"No details found for recipe ID: {recipeId}")
        return {}
    
    recipeDetails = recipeDetails[0]
    
    recipeId = recipeDetails.get('idMeal')
    recipeName = recipeDetails.get('strMeal')
    recipeCategory = recipeDetails.get('strCategory')
    recipeArea = recipeDetails.get('strArea')
    recipeThumbnail = recipeDetails.get('strMealThumb')
    recipeYoutube = recipeDetails.get('strYoutube')
    recipeInstructions = recipeDetails.get('strInstructions', '')

    recipeIngredients = []
    for i in range(1, 21):
        ingredient = recipeDetails.get(f'strIngredient{i}')
        measure = recipeDetails.get(f'strMeasure{i}')
        
        if ingredient:
            recipeIngredients.append(f"{measure} {ingredient}")

    res = {
        'id': recipeId,
        'name': recipeName,
        'category': recipeCategory,
        'area': recipeArea,
        'youtube': recipeYoutube,
        'thumbnail': recipeThumbnail,
        'instructions': recipeInstructions,
        'ingredients': recipeIngredients 
    }
    return res

def fetch_recipe_details_multithreaded(baseUrl, recipesByCategory, max_workers=10):
    print("====> Starting multithreaded recipe detail fetching...")
    recipeDetails = []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_recipe = {}
        for catName, recipes in recipesByCategory.items():
            for recipe in recipes:
                recipeId = recipe.get('idMeal')
                future = executor.submit(getRecipeDetails, baseUrl, recipeId)
                future_to_recipe[future] = recipeId

        for future in as_completed(future_to_recipe):
            recipeDetail = future.result()
            if recipeDetail:
                recipeDetails.append(recipeDetail)

    return recipeDetails


if __name__ == "__main__":
    baseUrl = "https://www.themealdb.com/api/json/v1/1/"

    # Obtain all recipe categories
    allCategories = getCategories(baseUrl)
    pprint(allCategories)

    # Obtain all recipe IDs for each category
    recipesByCategory = defaultdict(list)
    for category in allCategories:
        catId, catName = category['idCategory'], category['strCategory']
        recipes = getCategoryRecipes(baseUrl, catName, catId)
        pprint(recipes)
        recipesByCategory[catName].extend(recipes)

    recipeDetails = []
    
    # Scrape each recipe for details
    # for catName, recipes in recipesByCategory.items():
    #     for recipe in recipes:
    #         recipeDetail = getRecipeDetails(baseUrl, recipe.get('idMeal'))
    #         if recipeDetail:
    #             recipeDetails.append(recipeDetail)

    recipeDetails = fetch_recipe_details_multithreaded(baseUrl, recipesByCategory, max_workers=5)

    print(f"Total recipes fetched: {len(recipeDetails)}")
        
    # Obtain all possible ingredients as enum values
    outputFile = "recipe_details.json"
    
    with open(outputFile, 'w', encoding='utf-8') as f:
        json.dump(recipeDetails, f, ensure_ascii=False, indent=2)
           

    