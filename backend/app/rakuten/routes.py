from . import bp
from flask import jsonify, request, abort
import requests
import random
import time
import os

APP_ID = os.environ.get('RAKUTEN_API_APPLICATION_ID')
API_ENDPOINT = f'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId={APP_ID}'
KEYWORD_PREFIX = "&keyword="
PRODUCT_ID_PREFIX = "&itemCode="

SEARCH_KEYWORDS_FOR_PRESET = [
    ["ワイン", 'ビール', '日本酒', '焼酎', '果実酒'],  # Drinks
    [
        "ピザ",
        ' ラーメン',
        'ハンバーガー',
        'お茶漬け',
    ],  # Main foods
    ['枝豆', '唐揚げ', '刺身', '生ハム', 'ソーセージ'],  # Side foods
    ["コールスローサラダ", 'シーザーサラダ', 'ポテトサラダ', '和風サラダ'],  # Salads
]


@bp.route('/preset', methods=['GET'])
def make_preset():
    """
    Returns
    -------
    {
        'prset':[
            {
                item_name: string,
                rakuten_pruduct_id: string,
                price: int,
                image_URL: url[],
                review:double,
            }, ...
            ]
    }
    """
    preset = []

    keywords = generate_keywords_for_preset()
    for keyword in keywords:
        item = fetch_random_items_with_keywords(keyword)
        preset.extend(item)
        time.sleep(0.1)

    return jsonify({'preset': preset}), 200


@bp.route('/recommended', methods=['GET'])
def make_recommended():
    """
    params: keyword = < keyword for items>
    Returns
    -------
    {
        'status':string,
        'data':{
            'item': {
                    item_name: string,
                    rakuten_pruduct_id: string,
                    price: int,
                    image_URL: url[],
                }
            }
        }
    }
    """
    recommended = []

    keywords = ['酒', 'おつまみ']
    for keyword in keywords:
        items = fetch_random_items_with_keywords(keyword, 5)
        recommended.extend(items)
        time.sleep(0.1)

    return jsonify({'item': recommended}), 200


@bp.route('/search/items', methods=['GET'])
def search_with_keyword():
    """
    Returns
    -------
    {
        'items':[
            {
                item_name: string,
                rakuten_pruduct_id: string,
                price: int,
                image_URL: url[],
                review:double,
            }, ...
            ]
    }
    """
    keyword = request.args.get('keyword', type=str)
    if keyword == None:
        abort(400)
    items = []

    fetched_items = call_rakuten_search_API_with_keyword(keyword)
    if len(fetched_items) == 0:
        return jsonify({'items': []})

    for fetched_item in fetched_items:
        item = extract_item_attribute(fetched_item['Item'])
        items.append(item)

    return jsonify({'items': items}), 200


@bp.route('/search/product_id', methods=['GET'])
def search_with_itemCode():
    """
    Returns
    -------
    {
        'items':[
            {
                item_name: string,
                rakuten_pruduct_id: string,
                price: int,
                image_URL: url[],
                review:double,
            }, ...
            ]
    }
    """
    product_id = request.args.get('product_id', type=str)
    if product_id == None:
        abort(400)
    item = []

    max_call = 10
    fetched_items = call_rakuten_search_API_with_product_id(
        product_id)
    if (len(fetched_items) == 0):
        return jsonify({'item': []}), 200
    # for i in range(max_call):
    #     if (len(fetched_items) != 0):
    #         break
    #     fetched_items = call_rakuten_search_API_with_product_id(
    #     product_id)
            
    # print(fetched_items)
    time.sleep(0.2)

    item = extract_item_attribute(fetched_items[0]['Item'])
    return jsonify({'item': item}), 200


def generate_keywords_for_preset(num_items_per_genre=[2, 1, 2, 1]):
    """
    generate search keywords to make preset.
    The keywords are choosen from SEARCH_KEYWORDS_FOR_PRESET.
    By default,
    2*Drinks
    1*Main foods
    2*Side foods
    1*Salads
    """
    res = []
    for i in range(len(SEARCH_KEYWORDS_FOR_PRESET)):
        keywords = random.sample(SEARCH_KEYWORDS_FOR_PRESET[i],
                                 num_items_per_genre[i])
        res.extend(keywords)
    return res


def call_rakuten_search_API_with_keyword(keyword):
    uri = API_ENDPOINT + KEYWORD_PREFIX + keyword
    response = requests.get(uri)
    response_json = response.json()
    fetched_items = response_json["Items"]
    return fetched_items


def call_rakuten_search_API_with_product_id(product_id):
    uri = API_ENDPOINT + PRODUCT_ID_PREFIX + product_id
    response = requests.get(uri)
    response_json = response.json()
    try:
        fetched_items = response_json["Items"]
        return fetched_items
    except Exception as e:
        print(response_json)
        print(str(e))
        return []


def fetch_random_items_with_keywords(keyword, num_item=1):
    result = []
    fetched_items = call_rakuten_search_API_with_keyword(keyword)
    if len(fetched_items) == 0:
        return None
    random_selected_items = random.sample(fetched_items, num_item)
    for i in range(len(random_selected_items)):
        item = extract_item_attribute(random_selected_items[i]["Item"])
        result.append(item)
    return result


def extract_item_attribute(item_from_rakuten_api):
    item = {}
    item["item_name"] = item_from_rakuten_api["itemName"]
    item["rakuten_pruduct_id"] = item_from_rakuten_api["itemCode"]
    item["price"] = item_from_rakuten_api["itemPrice"]
    item['review'] = item_from_rakuten_api["reviewAverage"]
    item['image_URLs'] = item_from_rakuten_api['mediumImageUrls']
    return item
