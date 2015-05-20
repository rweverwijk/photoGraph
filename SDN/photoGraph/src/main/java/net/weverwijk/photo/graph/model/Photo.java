package net.weverwijk.photo.graph.model;


import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

@NodeEntity
public class Photo {

  @GraphId
  Long id;

  @Property
  String fileName;
  @Property
  String directory;

  public Photo() {
    super();
  }

  public Photo(String fileName) {
    this.fileName = fileName;
  }

  public String getFileName() {
    return fileName;
  }

  public String getDirectory() {
    return directory;
  }
}
