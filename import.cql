CREATE CONSTRAINT ON (p:Exposure) ASSERT p.name IS UNIQUE;
CREATE CONSTRAINT ON (p:FNumber) ASSERT p.name IS UNIQUE;
CREATE CONSTRAINT ON (p:Iso) ASSERT p.name IS UNIQUE;
CREATE CONSTRAINT ON (p:FocalLength) ASSERT p.name IS UNIQUE;
CREATE CONSTRAINT ON (p:Camera) ASSERT p.name IS UNIQUE;
CREATE CONSTRAINT ON (p:Lens) ASSERT p.name IS UNIQUE;
CREATE CONSTRAINT ON (p:Tag) ASSERT p.name IS UNIQUE;

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM
  "file:/Users/rvanweverwijk//projects/rweverwijk/photonodetest/out.csv"
  AS csvLine
MERGE (e:Exposure { name: csvLine.exposure })
MERGE (f:FNumber { name: csvLine.fNumber })
MERGE (i:Iso { name: csvLine.iso })
MERGE (fo:FocalLength { name: csvLine.focalLength })
MERGE (c:Camera { name: csvLine.camera })
MERGE (l:Lens { name: csvLine.lens })
CREATE (p:Photo {fileName: csvLine.fileName, directory: csvLine.directory})
CREATE (p)-[:HAS_EXIF]->(c)
CREATE (p)-[:HAS_EXIF]->(e)
CREATE (p)-[:HAS_EXIF]->(f)
CREATE (p)-[:HAS_EXIF]->(i)
CREATE (p)-[:HAS_EXIF]->(fo)
CREATE (p)-[:HAS_EXIF]->(l);


USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM
  "file:/Users/rvanweverwijk//projects/rweverwijk/photoGraph/out.csv"
  AS csvLine
CREATE (p:Photo {fileName: csvLine.fileName, directory: csvLine.directory, location: csvLine.directory + csvLine.fileName})
WITH p
foreach (tagName in split(p.directory, "/") | merge (t:Tag {name: tagName}) merge (p)-[:HAS_TAG]->(t))
return count(p);

match (p:Photo)
where not p.directory =~ ".*/.*"
merge (t:Tag {name: p.directory})
merge (p)-[:HAS_TAG]->(t)
return count(p);

match (t:Tag {name: "jpg"})-[r]-()
delete t,r;