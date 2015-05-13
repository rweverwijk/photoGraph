install.packages("devtools", dependencies = TRUE)
library(devtools)
devtools::install_github("nicolewhite/RNeo4j")
install.packages('RNeo4j')
library(RNeo4j)

install.packages('ggplot2')
library(ggplot2)

graph = startGraph("http://localhost:7474/db/data/", username = 'neo4j', password = 'test')

cnt.tag.photo = cypher(graph, 'match (t:Tag)<--(p:Photo) return t.name, count(p) order by count(p) desc')

cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(l:Lens) return l.name as exif, count(p) as numberOfPhotos order by count(p) desc')

cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(i:Iso) return i.name as exif, count(p) as numberOfPhotos order by count(p) desc')

bp<- ggplot(cnt.exif.photo, aes(x=exif, y=numberOfPhotos, fill=exif))+
  geom_bar(width = 1, stat = "identity")
bp

pie <- bp + coord_polar("x", start=0)
pie
