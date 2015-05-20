package net.weverwijk.photo.graph.model;

import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

@NodeEntity
public class Lens {

  @GraphId
  Long id;

  @Property
  String name;

  public Lens() {
    super();
  }

  public Lens(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
