from flask import Flask, request, jsonify
from lara_sdk import Translator, Credentials, TranslatePriority
import os

LARA_ACCESS_KEY_ID = "K0OG4096NMKLJC287B3C1ADBQ7"
LARA_ACCESS_KEY_SECRET = "rvfrSTFSKiQWz_I5Vna_ofP6BhImiBbc269b6lCAVOE"

# Initialization of the Translator class
credentials = Credentials(access_key_id=LARA_ACCESS_KEY_ID, access_key_secret=LARA_ACCESS_KEY_SECRET)
lara = Translator(credentials)


app = Flask(__name__)

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get("text")
    source_lang = data.get("source", "en-US")
    target_lang = data.get("target", "kn-IN")
    instructions = data.get("instructions", ["Be formal"])
    style = data.get("style", "fluid")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        res = lara.translate(
            text,
            source=source_lang,
            target=target_lang,
            instructions=instructions,
            style=style,
            content_type='text/plain',
            timeout_ms=2000,
            priority=TranslatePriority.NORMAL
        )
        return jsonify({"translation": res.translation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run Flask app on port 6767
    app.run(debug=True, host="0.0.0.0", port=6767)
