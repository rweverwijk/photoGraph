package net.weverwijk.photo.graph.model;


import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.Relationship;

@NodeEntity
public class Photo {

  @GraphId
  Long id;

  @Property
  String fileName;
  @Property
  String directory;

  @Relationship(type = "HAS_EXIF", direction = Relationship.OUTGOING)
  private Lens lens;

  public Photo() {
    super();
  }

  public Photo(String fileName, Lens lens) {
    this.fileName = fileName;
    this.lens = lens;
  }

  public String getFileName() {
    return fileName;
  }

  public String getDirectory() {
    return directory;
  }

  public Lens getLens() {
    return lens;
  }
}
