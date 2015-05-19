install.packages("devtools", dependencies = TRUE)
library(devtools)
devtools::install_github("nicolewhite/RNeo4j")
install.packages('RNeo4j')
library(RNeo4j)

install.packages('ggplot2')
library(ggplot2)

graph = startGraph("http://localhost:7474/db/data/", username = 'neo4j', password = 'test')

cnt.tag.photo = cypher(graph, 'match (t:Tag)<--(p:Photo) return t.name, count(p) order by count(p) desc')

# combination of focal length and 
cnt.mm.f.combination = cypher(graph, 'match (m:FocalLength)<-[:HAS_EXIF]-(p:Photo)-[:HAS_EXIF]->(f:FNumber) return m.name as flength, f.name as f, count(p) as numberOfPhotos order by numberOfPhotos')
cnt.mm.f.combination

cnt.mm.f.combination$flength <- as.numeric(gsub(pattern = " mm.*$", replacement = "", x = cnt.mm.f.combination$flength))
cnt.mm.f.combination$flength <- cut(cnt.mm.f.combination$flength, breaks=c(10,15,25,50,85,110,160,200,Inf))
cnt.mm.f.combination$f <- as.numeric(cnt.mm.f.combination$f)
     
p <- ggplot(cnt.mm.f.combination, aes(f, flength, size=factor(numberOfPhotos)))
p + geom_point()
cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(l:Lens) return l.name as exif, count(p) as numberOfPhotos order by count(p) desc')

cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(i:Iso) return i.name as exif, count(p) as numberOfPhotos order by count(p) desc')

bp<- ggplot(cnt.exif.photo, aes(x=exif, y=numberOfPhotos, fill=exif))+
  geom_bar(width = 1, stat = "identity")
bp

pie <- bp + coord_polar("x", start=0)
pie
