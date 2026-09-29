"""
MyEstia Android App
Flask application launcher for python-for-android WebView bootstrap.
"""

import os
import sys
import traceback


FLASK_HOST = "127.0.0.1"
FLASK_PORT = 5000


def run_flask():
    try:
        # Get the directory where this file is located
        app_directory = os.path.dirname(
            os.path.abspath(__file__)
        )

        os.chdir(app_directory)

        # Production settings
        os.environ["FLASK_ENV"] = "production"

        os.environ.setdefault(
            "SECRET_KEY",
            "myestia-android-2026"
        )

        print("[MYESTIA] Starting Flask...")
        print(f"[MYESTIA] Directory: {app_directory}")
        print(
            f"[MYESTIA] Server: "
            f"http://{FLASK_HOST}:{FLASK_PORT}"
        )

        # Import Flask application
        from app import app as flask_app

        print("[MYESTIA] Flask imported successfully.")

        # Start Flask
        flask_app.run(
            host=FLASK_HOST,
            port=FLASK_PORT,
            debug=False,
            use_reloader=False,
            threaded=True
        )

    except Exception as e:
        print("[MYESTIA] FLASK ERROR")
        print(str(e))
        print(traceback.format_exc())

        # Make sure the error is visible in the build/runtime logs
        sys.stderr.write(
            "\n[MYESTIA FLASK ERROR]\n"
            + traceback.format_exc()
            + "\n"
        )

        raise


if __name__ == "__main__":
    run_flask()
