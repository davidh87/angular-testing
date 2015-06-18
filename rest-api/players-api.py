#!/usr/bin/python

from flask import Flask
from flask import request, Response
from flask import jsonify

import argparse

configOptions = {
    'dev': {      
    }
}

deploymentOptions = {}

app = Flask(__name__)

players = {}

#API endpoints
@app.route('/players', methods=['GET'])
def getPlayers() :
    resp = jsonify(players)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/players/add', methods=['POST'])
def addPlayer():
    if request.headers['Content-Type'] != 'application/json':
        return Response(status=415)
    data = request.get_json()

    requiredParams = ['name', 'steamid', 'region']

    for param in requiredParams:
        if param not in data:
            return Response(response='{error: "Missing required parameter - %s"}' % (param), status=400)

    steamid = data['steamid']
    name = data['name']
    region = data['region']

    players[steamid] = {
        'name': name,
        'steamid': steamid,
        'region': region
    }

    return Response(status=200)

@app.route('/players/<steamid>', methods=['DELETE'])
def removePlayer(steamid):
    del players[steamid]

    return Response(status = 200)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Simple web server for listing players')
    parser.add_argument('--config', metavar='config', type=str, nargs=1, help='Which config to use', default=['dev'])
    
    args = parser.parse_args()
    deploymentOptions = configOptions[args.config[0]]

    app.debug = True
    app.run(host='0.0.0.0', port=5001)