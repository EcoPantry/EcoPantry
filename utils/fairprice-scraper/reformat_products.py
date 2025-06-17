import json


with open("fairprice_products_by_category_processed.json", "r", encoding="utf-8") as f:
    product_data = json.load(f)

newData = {}
idCtr = 0
for category, items in product_data.items():
    print("Processing category:", category)
    for item in items:
        newData[idCtr] = item
        newData[idCtr]["productId"] = idCtr
        newData[idCtr]["imageUrl"] = item.get("image_url", "")
        newData[idCtr]["productUrl"] = item.get("product_url", "")
        idCtr += 1

with open("final.json", "w", encoding="utf-8") as f:
    json.dump(newData, f, indent=2, ensure_ascii=False)