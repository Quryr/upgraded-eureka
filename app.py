from flask import Flask, send_from_directory
import os

# Создаём Flask-приложение
app = Flask(__name__, static_folder='static', template_folder='.')

# === МАРШРУТЫ САЙТА ===

# Главная страница
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Страница открытия кейса
@app.route('/case')
def case_page():
    return send_from_directory('.', 'case.html')

# Раздача статических файлов (css, js, картинки)
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# === ЗАПУСК СЕРВЕРА ===
if __name__ == '__main__':
    # Render передаёт свой порт через переменную окружения PORT
    port = int(os.environ.get('PORT', 10000))
    # Хост обязательно 0.0.0.0, иначе Render не увидит сервер
    app.run(host='0.0.0.0', port=port, debug=True)
