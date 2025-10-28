import json


def is_json(content: str) -> bool:
    try:
        json.loads(content)
        return True
    except Exception as e:
        return False
