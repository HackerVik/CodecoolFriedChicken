from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/memory')
def memory():
    try:
        diff = int(request.args.get("diff", -1))
    except ValueError:
        diff = None
    image_num = request.args.get("diff", 5)
    return render_template("memory.html" , diff=diff, image_num=image_num)


@app.route('/widow')
def widow():
    return render_template('black-widow.html')


if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )
