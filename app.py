from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='static', template_folder='templates')


# === ГЛАВНАЯ СТРАНИЦА ===
@app.route('/')
def index():
    return render_template('index.html')


# === СТРАНИЦА ОТДЕЛЬНОГО КЕЙСА ===
@app.route('/case.html')
def case():
    return render_template('case.html')


# === UPGRADE ===
@app.route('/upgrade')
def upgrade():
    return render_template('upgrade.html')


# === PROFILE (НОВОЕ) ===
@app.route('/profile')
def profile():
    return render_template('profile.html')


# === ЗАПУСК СЕРВЕРА ===
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
