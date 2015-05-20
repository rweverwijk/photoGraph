package net.weverwijk.photo.graph.model;


import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;

@NodeEntity
public class Photo {

  @GraphId
  Long id;

  String fileName;

  public Photo() {
    super();
  }

  public Photo(String fileName) {
    this.fileName = fileName;
  }
}
