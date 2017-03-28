from app import app
from flask import render_template, request, url_for, redirect
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['HW']
User = db['user']

@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')

@app.route('/create_table', methods=['POST'])
def create_table():
    if request.method == 'POST':
        if request.form['send_create_collection']:
            create_collection = str(request.form['create_collection'])
            db.create_collection(create_collection)
        else:
            return 'Error Input!'
    return render_template("index.html")

@app.route('/delete_table', methods=['POST'])
def delete_table():
    if request.method == 'POST':
        if request.form['send_delete_collection']:
            delete_collection = str(request.form['delete_collection'])
            db.get_collection(delete_collection).drop()
        else:
            return "Error Input!"
    return render_template("index.html")

@app.route('/read_table', methods=['POST'])
def read_table():
    if request.method == 'POST':
        read_collection = request.form['read_collection']
        if request.form['send_read_collection'] and read_collection != '':
            read_collection = db.get_collection(read_collection).name
            return render_template('index.html', read_collection = read_collection)
        else:
            return "Not Found"

@app.route('/write_table', methods=['POST'])
def write_table():
    if request.method == 'POST':
        if request.form['send_write_collection']:
            write_oringal_collection = str(request.form['write_oringal_collection'])
            write_new_collection = str(request.form['write_new_collection'])
            db.get_collection(write_oringal_collection).rename(write_new_collection)
    return render_template("index.html", write_new_collection = write_new_collection)
            

@app.route('/create_record', methods=['POST'])
def create_record():
    if request.method == 'POST':
        if request.form['send_create_document']:
            create_document_collection = request.form['create_document_collection']
            create_document_name = request.form['create_document_name']
            create_document_class = request.form['create_document_class']
            add = {'name':create_document_name, 'class': create_document_class}
            db.get_collection(create_document_collection).insert_one(add)
        return render_template("index.html")

@app.route('/delete_record', methods=['POST'])
def delete_record():
    if request.method == 'POST':
        if request.form['send_delete_document']:
            delete_collection_name = request.form['delete_collection_name']
            delete_document_name = request.form['delete_document_name']
            delete_document_class = request.form['delete_document_class']
            delete = {'name':delete_document_name, 'class':delete_document_class}
            db.get_collection(delete_collection_name).delete_one(delete)
        return render_template("index.html")

@app.route('/write_record', methods=['POST'])
def write_record():
    if request.method == 'POST':
        if request.form['send_write_document']:
            write_collection_name = request.form['write_collection_name']
            write_oringal_document_name = request.form['write_oringal_document_name']
            write_new_document_name = request.form['write_new_document_name']
            oringal_document = {write_oringal_document_name : write_oringal_document_name}
            db.get_collection(write_collection_name).update({'name':write_oringal_document_name}, {'name':write_new_document_name})
        return render_template('index.html')




