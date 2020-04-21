import os
from app import app

env = os.getenv("ENV", "dev")

if env == "dev" and __name__ == "__main__":
    app.run("0.0.0.0", 8080, True)
