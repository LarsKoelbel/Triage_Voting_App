import threading

from flask import Flask, send_from_directory, request, Response, jsonify, redirect

app = Flask(__name__, static_folder="static")

# Simple credentials
USERNAME = "admin"
PASSWORD = "123456"

OPEN = False
FINISHED = False

def check_auth(username, password):
    return username == USERNAME and password == PASSWORD

def authenticate():
    return Response(
        'Login required', 401,
        {'WWW-Authenticate': 'Basic realm="Protected"'}
    )

def requires_auth(f):
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

# Serve index.html at /triage
@app.route('/triage')
def index():
    if OPEN:
        return send_from_directory('static', 'index.html')
    else:
        if FINISHED:
            return send_from_directory('static', 'over.html')
        else:
            return redirect("https://www.theaterwerft.de/")

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# Voting system
class Character:
    def __init__(self, name):
        self.full_name = name
        self.value = 0

    def __repr__(self):
        return f'{self.full_name}: {self.value}'

VOTES = {
    'kap': Character('Kapitän Johnson'),
    'sch': Character('Arielle Fleischer'),
    'mas': Character('Jasiel'),
    'none': Character('Niemand'),
}

IDS = {}

@app.route("/api/cast-vote-once", methods=["POST"])
def example_post():
    data = request.get_json()
    if not data or "key" not in data:
        return jsonify({"error": "No data provided"}), 400

    if not OPEN:
        print(f'A new request from was blocked, because the vote is closed')
        return jsonify({}), 200

    client_id = data['id']
    if client_id in IDS:
        print(f'A new request from {client_id} was blocked')
        return jsonify({}), 200

    key = data["key"]
    if key in VOTES:
        VOTES[key].value += 1
        print(f'Vote cast for \'{VOTES[key].full_name}\' by {client_id} --> Value now at {VOTES[key].value}')
        IDS[client_id] = key
        return jsonify({"status": "ok"}), 200
    else:
        return jsonify({"error": "Invalid key"}), 400

@app.route("/api/get-vote-if-exists", methods=["POST"])
def get_vote_if_exists():
    data = request.get_json()
    if not data or "id" not in data:
        return jsonify({"error": "No id provided"}), 400

    voter_id = data["id"]
    if voter_id in IDS:
        print(f'Vote found for id {voter_id}')
        return jsonify({'status': 'ok', 'key': IDS[voter_id]}), 200

    return jsonify({'status': 'false'}), 200


def get_results_ordered():
    result = []
    for el in VOTES:
        result.append(VOTES[el])
    result.sort(key=lambda x: x.value, reverse=True)
    return result

# CLI thread
def cli_thread():
    global IDS, VOTES, OPEN, FINISHED
    while True:
        i = input("Command: ").strip().lower()
        if i == 'clear':
            IDS = {}
            # reinitialize VOTES with fresh Character objects
            VOTES = {
                'kap': Character('Kapitän Johnson'),
                'sch': Character('Arielle Fleischer'),
                'mas': Character('Jasiel'),
                'none': Character('Niemand'),
            }
            print("Votes and IPS cleared.")
        elif i == 'show':
            for k, v in VOTES.items():
                print(f"{v.full_name}: {v.value}")
        elif i == 'result':
            print(get_results_ordered())
        elif i == 'open':
            OPEN = True
            print('Vote is now open...')
        elif i == 'finish':
            OPEN = False
            FINISHED = True
            print('Vote is now marked as over...')
        else:
            print("Unknown command. Available: clear, show")

if __name__ == "__main__":
    threading.Thread(target=cli_thread, daemon=True).start()
    app.run(debug=False, use_reloader=False, port=3012, host='0.0.0.0')

