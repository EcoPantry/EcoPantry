import requests 
from bs4 import BeautifulSoup
from typing import List, Dict
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import json

def scroll_and_scrape(url, scroll_pause=2, max_scrolls=10):
    options = Options()
    options.add_argument("--headless")  # Optional: run in background
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


def get_categories(url) -> List[Dict[str, str]]: 
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, headers)

    soup = BeautifulSoup(resp.text, "html.parser")
    # Select all categories and links. Luckily all links are at the same level, e.g Bakery and Drinks categories are at /category/<category_name>
    categories = soup.select("li.sc-d21d9541-1 a[href]") 
    prettified_categories = [{cat.text.strip(): cat['href']} for cat in categories]
    return prettified_categories 

def get_category_products(url: str) -> List[Dict[str, str]]:
    soup = scroll_and_scrape(url, 1, 15) # At most 15 pages worth of products in a category?

    products = []
    for tile in soup.select('div.product-container'):
        products.append(tile.select_one("a[href].sc-e68f503d-3").get('href').strip())
    return products

def get_product_details(url: str, category: str) -> Dict[str, str]:
    options = Options()
    options.add_argument("--headless")  
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    soup = BeautifulSoup(driver.page_source, "html.parser")

    img_tag = soup.select_one('img[alt="Product Image"]')

    # If not found, use partial match fallback
    if not img_tag:
        img_tag = soup.find("img", src=lambda s: s and "media.nedigital.sg" in s)

    image_url = img_tag.get("src") if img_tag else None


    product_details = {
        "name": soup.select_one("span.sc-ab6170a9-1.eZAqam").text.strip(),
        "price": soup.select_one("span.sc-ab6170a9-1.sc-747538d2-5.jBFJrC.eQpgNG").text.strip(),
        "brand": soup.select_one('span[data-testid="brandDetails"]').text.strip(),
        "weight": soup.select_one("span.quantity").text.strip(),
        "image_url": image_url,
        "product_url": url,
        "category": category
    }
    
    return product_details



import json

if __name__ == "__main__":
    base_url = "https://www.fairprice.com.sg/"
    categories = get_categories(f"{base_url}/categories")
    relevant_categories = [
    'fruits', 'vegetables', 'meatballs', 'chicken', 'pork', 'beef & lamb', 'fish & seafood',
    'eggs', 'fresh milk', 'uht milk', 'cheese', 'butter, margarine & spreads', 'cream', 'yoghurt',
    'breads', 'bakery', 'breakfast',
    'rice', 'noodles', 'pasta', 'oil', 'seasonings', 'soups', 'condiments',
    'cooking paste & sauces', 'sugar & sweeteners', 'dried food', 'baking needs',
    'frozen food', 'frozen desserts', 'frozen seafood', 'frozen meat', 'ice cream', 'ready-to-eat',
    'canned food', 'jams, spreads & honey', 'dried fruits & nuts',
    'coffee', 'tea', 'juices', 'water', 'drink mixers', 'chilled beverages', 'non alcoholic',
    'biscuits', 'chocolates', 'sweets', 'snacks', 'snacks & confectionery']
    categories = [
        cat for cat in categories
        if list(cat.keys())[0] in relevant_categories
    ]

    output_file = "fairprice_products_by_category.json"
    failed_file = "fairprice_failed_products.json"
    failed_products = []

    all_category_items = [
    (cat_name, cat_url)
    for category_dict in categories
    for cat_name, cat_url in category_dict.items()
]

with open(output_file, "w", encoding="utf-8") as f:
    f.write("{\n")

    for i, (cat_name, cat_url) in enumerate(all_category_items):
        print(f"===> Scanning category: {cat_name}, URL: {cat_url}")
        products = get_category_products(f"{base_url}/category/{cat_url}")
        print(f"Found {len(products)} products in category '{cat_name}'")

        category_items = []

        for product_url in products:
            full_product_url = f"{base_url}{product_url}"
            print(f"Fetching details for product: {full_product_url}")

            try:
                details = get_product_details(full_product_url, cat_name)
                category_items.append(details)

            except Exception as e:
                print(f"❌ Error scraping {full_product_url}: {e}")
                failed_products.append({
                    "url": full_product_url,
                    "category": cat_name,
                    "error": str(e)
                })

        # Write category block
        json_str = json.dumps(cat_name) + ": " + json.dumps(category_items, ensure_ascii=False, indent=2)
        if i < len(all_category_items) - 1:
            f.write(f"{json_str},\n")
        else:
            f.write(f"{json_str}\n")

    f.write("}\n")

    # ✅ Save all failed products to a separate file
    with open(failed_file, "w", encoding="utf-8") as f:
        json.dump(failed_products, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Finished scraping. {len(failed_products)} products failed and were saved to {failed_file}")

    
    
