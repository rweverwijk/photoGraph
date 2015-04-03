import os
from flask import Flask, request, send_from_directory
from py2neo import Graph, Node, Relationship,watch
import json

app = Flask(__name__)

# watch("httpstream")
graph = Graph('http://neo4j:test@localhost:7474/db/data')

graph.cypher.execute('MATCH (t:Tag) RETURN t ORDER BY t.name')

def get_tags():
    query_result = graph.cypher.execute('MATCH (t:Tag) RETURN t ORDER BY t.name')
    tags = []
    for record in query_result:
        tags.append({'name': record.t['name']})
    return json.dumps(tags)

def get_photos(options):
  query_partial = [
    'MATCH (p:Photo)',
    'WITH p',
    'MATCH (p)-[:HAS_TAG]->(t)',
    'WITH p, collect(t.name) as t',
    'WITH p,t, rand() as random',
    'RETURN p.fileName as fileName, p.directory as directory, t as tags, random',
    'order by random' if options['order'] == "random" else 'order by fileName',
    'LIMIT 90'
  ];
  query_result = graph.cypher.execute('\n'.join(query_partial))
  photos = []

  for record in query_result:
    photos.append(transformImageName({'fileName': record.fileName, 'directory': record.directory, 'tags': record.tags}))

  return json.dumps(photos)

def transformImageName(photo):
  photo['thumbnailUrl'] = photo['fileName'].replace(".JPG", "_t.JPG").replace(".jpg", "_t.jpg");
  photo['fileName'] = photo['fileName'].replace(".JPG", "_b.JPG").replace(".jpg", "_b.jpg");
  return photo

@app.route('/tags')
def tags():
    return get_tags()

@app.route('/photo')
def photos():
  options = {'order': request.args.get('order')}
  return get_photos(options)

@app.route('/thumbnail/<path:path>')
def thumbnail(path):
  print('get thumbnail for: ' + path)
  return send_from_directory('../nodejs/thumbnail', path)

if __name__ == '__main__':
    app.run(debug=True)