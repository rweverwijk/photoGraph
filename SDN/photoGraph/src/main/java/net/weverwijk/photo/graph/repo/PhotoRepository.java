package net.weverwijk.photo.graph.repo;

import net.weverwijk.photo.graph.model.Photo;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends GraphRepository<Photo> {

  List<Photo> findByFileName(String fileName);

}
