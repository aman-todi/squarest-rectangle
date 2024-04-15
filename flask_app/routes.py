# Author: Aman Todi

from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, jsonify
from flask_socketio import SocketIO
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from . import socketio

import firebase_admin
from firebase_admin import credentials, firestore, auth, storage

db1 = database()
db2 = firestore.client()

bucket = storage.bucket()

def getUser():
	return session['email'] if 'email' in session else 'Unknown'

@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	return render_template('home.html', user=getUser())


@app.route('/track-interaction', methods=['POST'])
def track_interaction():
    try:
        if not session.get('email'):
            return jsonify({"error": "User not logged in"}), 403

        email = session['email']
        interaction_data = request.json

        # Store the interaction data in Firebase under the user's email
        db2.collection('user_interactions').document(email).set(interaction_data)
        return jsonify({"success": "Data stored successfully"}), 200
    except Exception as e:
        app.logger.error('Failed to track interaction: %s', e)
        return jsonify({"error": "Internal Server Error"}), 500


@app.route('/processfeedback', methods = ['POST'])
def processfeedback():
	name = request.form['name']
	email = request.form['email']
	comment = request.form['comment']

	db1.insertRows('feedback',['name','email','comment'],[[name, email, comment]])

	feedback = db1.query("SELECT * FROM feedback;")
	return render_template('feedback.html',feedback_data=feedback, user=getUser())


@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

@app.route('/login')
def login():
    next_url = request.args.get('next', '/')  # Default to home page if 'next' not provided
    return render_template('login.html', next=next_url, user=getUser())

@app.route('/logout')
def logout():
	session.pop('email', default=None)
	return redirect('/')

@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
	form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
	print(form_fields)
	auth = db1.authenticate(form_fields['email'],form_fields['password'])
	if auth['success'] == 1:
		session['email'] = form_fields['email']
		next_url = form_fields.get('next', '/')
		return json.dumps({'success': 1,'next': next_url})
	elif auth['success'] == 0:
		return json.dumps({'success': 0})
	
@app.route('/signup')
def signup():
    return render_template('signup.html', user=getUser())

@app.route('/processsignup', methods=['POST'])
def processsignup():
    email = request.form['email']
    password = request.form['password']
    result = db1.createUser(email, password)
    if result['success']:
        return json.dumps({'success': 1})
    else:
        return json.dumps({'success': 0})