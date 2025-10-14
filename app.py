from flask import Flask, render_template

app = Flask(__name__, static_folder='static', template_folder='.')

# Главная страница
@app.route('/')
def home():
    return render_template('index.html')

# Страница кейса
@app.route('/case.html')
def case_page():
    return render_template('case.html')

# Обслуживание статических файлов
@app.route('/static/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
