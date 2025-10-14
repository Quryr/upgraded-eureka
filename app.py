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

# Чтобы Flask отдавал все статические файлы (CSS, JS, изображения)
@app.route('/static/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

if __name__ == '__main__':
    app.run(debug=True)
