import math
from app import db
from app.Common.Utils import gen_pages


class CommonModel:
    def __init__(self):
        self.table = db['default']

    def get_list(self, query={}, page=1, size=20, field_filter=None, **kwargs):
        page = int(page)
        size = int(size)
        skip = (page - 1) * size
        result = self.table.find(query, field_filter, **kwargs).sort([("_id", -1)])
        if result is None:
            count = 0
            pages = 0
            page_list = []
            foo = 0
            next_num = 0
            prev_num = 0
        else:
            count = result.count()
            pages = math.ceil(count/size)
            page_list = gen_pages(page, pages)
            foo = min([page, pages])
            next_num = min([int(page+1), pages])
            prev_num = max([0, (page - 1)])

        d = {
            "count": count,
            "pages": pages,
            "page": page_list,
            "foo": foo,
            "next_num": next_num,
            "prev_num": prev_num,
            "data": result.skip(skip).limit(size)
        }
        return d
