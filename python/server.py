import os
from flask import Flask, request, send_from_directory
from neo4j.v1 import GraphDatabase, basic_auth 
import json

app = Flask(__name__)
thumbnail_base_dir = '/Users/rvanweverwijk/Pictures/thumbnails'

driver = GraphDatabase.driver('bolt://localhost', auth=basic_auth('neo4j', 'test'))
session = driver.session()
def get_tags():
    query_result = session.run('MATCH (t:Tag) RETURN t.name as name ORDER BY t.name')
    tags = []
    for record in query_result:
        tags.append({'name': record['name']})
    return json.dumps(tags)

def get_photos(options):
  query_partial = [
    'MATCH (p:Photo {thumbnail: true})',
    'WITH p',
    'MATCH (p)-[:HAS_TAG]->(t)',
    'WITH p, collect(t.name) as t',
    'WITH p,t, rand() as random',
    'RETURN p.name as name, p.directory as directory, t as tags, random',
    'order by random' if options['order'] == "random" else 'order by name',
    'LIMIT 90'
  ];
  for tag in options['tags']:	
    query_partial.insert(4,'MATCH (p)-[:HAS_TAG]->(:Tag {name: "' + tag + '"})')
  print('\n'.join(query_partial))
  query_result = session.run('\n'.join(query_partial))
  photos = []

  for record in query_result:
    photos.append(transformImageName({'fileName': record['name'], 'directory': record['directory'], 'tags': record['tags']}))

  return json.dumps(photos)

def transformImageName(photo):
  photo['thumbnailUrl'] = photo['fileName'].replace(".JPG", "_t.JPG").replace(".jpg", "_t.jpg")
  photo['fileName'] = photo['fileName'].replace(".JPG", "_b.JPG").replace(".jpg", "_b.jpg")
  return photo

@app.route('/tags')
def tags():
    return get_tags()

@app.route('/photo')
def photos():
  options = {'order': request.args.get('order'), 'tags': request.args.getlist('tag')}
  print(options)
  return get_photos(options)

@app.route('/thumbnail/<path:path>')
def thumbnail(path):
  return send_from_directory(thumbnail_base_dir, path)

if __name__ == '__main__':
    app.run(debug=True)