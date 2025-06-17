import json

import requests

def main():
    with open("final.json", "r", encoding="utf-8") as f:
        data = json.load(f) 


    # Save the updated data back to a new JSON file
    with open("final_with_off_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()