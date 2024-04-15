import mysql.connector
import glob
import json
import csv
from io import StringIO
import itertools
import hashlib
import os
import cryptography
from cryptography.fernet import Fernet
from math import pow
import random
from datetime import date

class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'
        self.tables         = ['users','feedback']
        
        # For passwords
        self.encryption     =  {   'oneway': {'salt' : b'averysaltysailortookalongwalkoffashortbridge',
                                                 'n' : int(pow(2,5)),
                                                 'r' : 9,
                                                 'p' : 1
                                             },
                                'reversible': { 'key' : '7pK_fnSKIjZKuv_Gwc--sZEMKn2zc8VvD6zS96XcNHE='}
                                }

    def query(self, query = "SELECT * FROM users", parameters = None):

        cnx = mysql.connector.connect(host     = self.host,
                                      user     = self.user,
                                      password = self.password,
                                      port     = self.port,
                                      database = self.database,
                                      charset  = 'latin1'
                                     )


        if parameters is not None:
            cur = cnx.cursor(dictionary=True)
            escaped_parameters = tuple(cnx._cmysql.escape_string(p) for p in parameters)
            cur.execute(query, escaped_parameters)
        else:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query)

        # Fetch one result
        row = cur.fetchall()
        cnx.commit()

        if "INSERT" in query:
            cur.execute("SELECT LAST_INSERT_ID()")
            row = cur.fetchall()
            cnx.commit()
        cur.close()
        cnx.close()
        return row

    def createTables(self, purge=False, data_path = 'flask_app/database/'):
        '''Creates and populates database tables'''

        tables = ['feedback','users']
        
        # Delete all tables from database
        if purge == True:        
            self.query(f"DROP TABLE IF EXISTS feedback;")
            self.query(f"DROP TABLE IF EXISTS users;")

        # Build tables in database from csv files
        for table in tables:

            with open(data_path + 'create_tables/' + table + '.sql', 'r') as f:
                sql_query = f.read()
                self.query(sql_query)

            with open(data_path + 'initial_data/' + table + '.csv','r') as f:
                reader = csv.reader(f)
                headers = next(reader) 
                rows = list(reader)    
                self.insertRows(table, headers, rows)

    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        '''Insert rows of data into sql tables'''

        for row in parameters: 
            values = ""
            for val in row:
                # Format for integers and Null values
                if val.isdigit() or val == "NULL":
                    values += val + ','
                # Format for strings
                else:
                    values += '"' + val + '",'

            values = values[:-1]

            insert_query = f'INSERT INTO {table} ({", ".join(columns)}) VALUES ({values});'
            self.query(insert_query)


#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
    def createUser(self, email='me@email.com', password='password', role='user'):

        encrypted_email = self.onewayEncrypt(email)
        # Check if the user already exists
        user_data = self.query("SELECT * FROM users WHERE email = %s", (encrypted_email,))
        
        # Return failure if user exists
        if user_data:
            return {"success": 0}

        # Encrypt the password
        encrypted_pswd = self.onewayEncrypt(password)

        # Prepare data for insertion
        # Assuming user_id is auto-incremented, we don't need to calculate 'ind'
        user_info = [[role, encrypted_email, encrypted_pswd]]

        # Insert the new user into the database using insertRows
        self.insertRows(table='users', columns=['role', 'email', 'password'], parameters=user_info)

        # Return success
        return {'success': 1}

    def authenticate(self, email='me@email.com', password='password'):

        encrypted_email = self.onewayEncrypt(email)
        # Check if the user already exists
        user_data = self.query("SELECT * FROM users WHERE email = %s", (encrypted_email,))
        
        # Check invalid user
        if not user_data:
            return {'success': 0}
        
        else:
            # Check password
            if user_data[0]['password'] == self.onewayEncrypt(password):
                return {'success': 1}
            
            # Invalid password
            else:
                return {'success': 0}

    def onewayEncrypt(self, string):
        encrypted_string = hashlib.scrypt(string.encode('utf-8'),
                                          salt = self.encryption['oneway']['salt'],
                                          n    = self.encryption['oneway']['n'],
                                          r    = self.encryption['oneway']['r'],
                                          p    = self.encryption['oneway']['p']
                                          ).hex()
        return encrypted_string


    def reversibleEncrypt(self, type, message):
        fernet = Fernet(self.encryption['reversible']['key'])
        
        if type == 'encrypt':
            message = fernet.encrypt(message.encode())
        elif type == 'decrypt':
            message = fernet.decrypt(message).decode()

        return message