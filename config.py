# -*- coding: utf-8 -*-
import os


class Config(object):
    PAGE_INDEX = 1
    PAGE_NUM = 20


class DevConfig(Config):
    SERVER_URL = 'http://0.0.0.0:8080'
    MONGO_URI = "127.0.0.1"
    MONGO_PORT = 27017
    MONGO_DB = "test_case"
    LOG_ROOT_DIR = os.getcwd()


class ProductConfig(Config):
    SERVER_URL = 'http://0.0.0.0:8080'
    MONGO_URI = "127.0.0.1"
    MONGO_PORT = 27017
    MONGO_DB = "test_case"
    LOG_ROOT_DIR = os.getcwd()


class ConfigCreator:
    def __init__(self):
        env = os.environ.get('ENV', 'dev')
        if env == 'product':
            self.__config = ProductConfig()
        else:
            self.__config = DevConfig()

    def get_config(self):
        return self.__config


def get_config():
    return ConfigCreator().get_config()
