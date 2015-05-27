install.packages("devtools", dependencies = TRUE)
devtools::install_github("nicolewhite/RNeo4j")
install.packages('RNeo4j')
install.packages('ggplot2')

library(devtools)
library(RNeo4j)
library(ggplot2)

graph = startGraph("http://localhost:7474/db/data/", username = 'neo4j', password = 'test')

cnt.tag.photo = cypher(graph, 'match (t:Tag)<--(p:Photo) return t.name as tag, count(p) as numberOfPhotos order by numberOfPhotos desc')

# Bar plot
bp<- ggplot(cnt.tag.photo, aes(x=tag, y=numberOfPhotos, fill=tag)) + geom_bar(stat="identity")
bp

# combination of focal length and 
cnt.mm.f.combination = cypher(graph, 'match (m:FocalLength)<-[:HAS_EXIF]-(p:Photo)-[:HAS_EXIF]->(f:FNumber) return m.name as flength, f.name as f, count(p) as numberOfPhotos order by numberOfPhotos')
cnt.mm.f.combination

cnt.mm.f.combination$flength <- as.numeric(gsub(pattern = " mm.*$", replacement = "", x = cnt.mm.f.combination$flength))
cnt.mm.f.combination$flength <- cut(cnt.mm.f.combination$flength, breaks=c(10,15,25,50,85,110,160,200,Inf))
cnt.mm.f.combination$f <- as.numeric(cnt.mm.f.combination$f)
     
p <- ggplot(cnt.mm.f.combination, aes(f, flength, size=factor(numberOfPhotos)))
p + geom_point()

# different exif information plots.
cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(l:Lens) return l.name as exif, count(p) as numberOfPhotos order by count(p) desc')

cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(i:Iso) return i.name as exif, count(p) as numberOfPhotos order by count(p) desc')

cnt.exif.photo = cypher(graph, 'match (p:Photo)-[:HAS_EXIF]->(c:Camera) return c.name as exif, count(p) as numberOfPhotos order by count(p) desc')

# Bar plot
cnt.exif.photo$exif <- factor(cnt.exif.photo$exif, levels = cnt.exif.photo$exif[order(-cnt.exif.photo$numberOfPhotos)])
bp<- ggplot(cnt.exif.photo, aes(x=exif, y=numberOfPhotos, fill=exif)) + geom_bar(stat="identity")
bp <- bp + theme(axis.text.x = element_text(angle = 90, hjust = 1))
bp

# pie chart
pie <- ggplot(cnt.exif.photo, aes(x=factor(0), y=numberOfPhotos, fill=exif)) + geom_bar(stat="identity")
pie <- pie + coord_polar(theta = "y")
pie
