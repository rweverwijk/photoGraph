package net.weverwijk.photo.graph.repo;

import net.weverwijk.photo.graph.model.Photo;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoRepository extends GraphRepository<Photo> {


}
