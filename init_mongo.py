import sys
import pymongo

try:
    mongo_host = sys.argv[1]
except IndexError as e:
    print(f"请输入初始化的mongo地址!")

db = pymongo.MongoClient(mongo_host, 27017)['test_case']['tables']
db.insert_many(
    [
        {"_id": "users", "index": 1},
        {"_id": "products", "index": 1},
        {"_id": "product_category_index", "index": 1},
        {"_id": "product_version_index", "index": 1},
        {"_id": "cases", "index": 1},
        {"_id": "case_priority_index", "index": 1},
        {"_id": "run_index", "index": 1},
        {"_id": "product_module_index", "index": 1},
        {"_id": "plans", "index": 1},
        {"_id": "run_case_index", "index": 1}
    ], ordered=False
)
