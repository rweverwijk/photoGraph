install.packages("devtools", dependencies = TRUE)
library(devtools)
devtools::install_github("nicolewhite/RNeo4j")
install.packages('RNeo4j')
library(RNeo4j)

graph = startGraph("http://localhost:7474/db/data/", username = 'neo4j', password = 'test')

cnt.tag.photo = cypher(graph, 'match (t:Tag)<--(p:Photo) return t.name, count(p) order by count(p) desc')

cnt.tag.photo
