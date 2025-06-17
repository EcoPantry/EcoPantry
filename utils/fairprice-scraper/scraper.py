import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict
import time
import json

# --- Scroll and scrape category page ---
def scroll_and_scrape(url, scroll_pause=2, max_scrolls=10):
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    last_height = driver.execute_script("return document.body.scrollHeight")

    for i in range(max_scrolls):
        print(f"Scrolling... {i+1}/{max_scrolls}")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(scroll_pause)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()
    return soup

# --- Extract category links ---
def get_categories(url) -> List[Dict[str, str]]:
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, headers)
    soup = BeautifulSoup(resp.text, "html.parser")
    categories = soup.select("li.sc-d21d9541-1 a[href]")
    return [{cat.text.strip(): cat['href']} for cat in categories]

# --- Extract product URLs within a category ---
def get_category_products(url: str) -> List[str]:
    soup = scroll_and_scrape(url, 1, 15)
    return [
        tile.select_one("a[href].sc-e68f503d-3")["href"].strip()
        for tile in soup.select("div.product-container")
        if tile.select_one("a[href].sc-e68f503d-3")
    ]

# --- Extract product details from a product page ---
def get_product_details(url: str, category: str) -> Dict[str, str]:
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    img_tag = soup.select_one('img[alt="Product Image"]') or soup.find("img", src=lambda s: s and "media.nedigital.sg" in s)
    image_url = img_tag.get("src") if img_tag else None

    return {
        "name": soup.select_one("span.sc-ab6170a9-1.eZAqam").text.strip(),
        "price": soup.select_one("span.sc-ab6170a9-1.sc-747538d2-5.jBFJrC.eQpgNG").text.strip(),
        "brand": soup.select_one('span[data-testid="brandDetails"]').text.strip(),
        "weight": soup.select_one("span.quantity").text.strip(),
        "image_url": image_url,
        "product_url": url,
        "category": category
    }

# --- Helper to wrap product scraping for threading ---
def scrape_one_product(product_url: str, category: str, base_url: str):
    full_url = f"{base_url}{product_url}"
    print(f"Fetching details for: {full_url}")
    try:
        return get_product_details(full_url, category), None
    except Exception as e:
        return None, {"url": full_url, "category": category, "error": str(e)}

# --- Main execution ---
if __name__ == "__main__":
    base_url = "https://www.fairprice.com.sg/"
    categories = get_categories(f"{base_url}/categories")

    # Filter to relevant recipe-related categories
    relevant_categories = [
        'fruits', 'vegetables', 'meatballs', 'chicken', 'pork', 'beef & lamb', 'fish & seafood',
        'eggs', 'fresh milk', 'uht milk', 'cheese', 'butter, margarine & spreads', 'cream', 'yoghurt',
        'breads', 'bakery', 'breakfast',
        'rice', 'noodles', 'pasta', 'oil', 'seasonings', 'soups', 'condiments',
        'cooking paste & sauces', 'sugar & sweeteners', 'dried food', 'baking needs',
        'frozen food', 'frozen desserts', 'frozen seafood', 'frozen meat', 'ice cream', 'ready-to-eat',
        'canned food', 'jams, spreads & honey', 'dried fruits & nuts',
        'coffee', 'tea', 'juices', 'water', 'drink mixers', 'chilled beverages', 'non alcoholic',
        'biscuits', 'chocolates', 'sweets', 'snacks', 'snacks & confectionery'
    ]

    # Flatten and filter all categories
    filtered_categories = [
        (cat_name, cat_url)
        for category_dict in categories
        for cat_name, cat_url in category_dict.items()
        if cat_name in relevant_categories
    ]

    output_file = "fairprice_products_by_category.json"
    failed_file = "fairprice_failed_products.json"
    failed_products = []

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("{\n")

        for i, (cat_name, cat_url) in enumerate(filtered_categories):
            print(f"\n===> Scanning category: {cat_name}")
            products = get_category_products(f"{base_url}/category/{cat_url}")
            print(f"Found {len(products)} products in '{cat_name}'")

            category_items = []

            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = [executor.submit(scrape_one_product, p, cat_name, base_url) for p in products]
                for future in as_completed(futures):
                    result, error = future.result()
                    if result:
                        category_items.append(result)
                    elif error:
                        failed_products.append(error)

            # Write this category to JSON
            json_str = json.dumps(cat_name) + ": " + json.dumps(category_items, ensure_ascii=False, indent=2)
            f.write(f"{json_str},\n" if i < len(filtered_categories) - 1 else f"{json_str}\n")

        f.write("}\n")

    with open(failed_file, "w", encoding="utf-8") as f:
        json.dump(failed_products, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Scraping complete. {len(failed_products)} products failed. See `{failed_file}`.")
