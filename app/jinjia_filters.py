# -*- coding: utf-8 -*-
import time


class JJFilters:
    @staticmethod
    def unix_2_time(unix, fmt="%Y-%m-%d %H:%M:%S"):
        tm = time.localtime(unix)
        return time.strftime(fmt, tm)

    @staticmethod
    def is_odd(num):
        if int(num) % 2 == 0:
            return True
        return False
