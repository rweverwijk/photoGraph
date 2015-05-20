package net.weverwijk.photo.graph.repo;

import net.weverwijk.photo.graph.model.Photo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.neo4j.helpers.collection.Iterables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@ContextConfiguration(classes = {TestConfig.class})
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class PhotoRepositoryTest {

  @Autowired
  PhotoRepository repo;

  @Test
  public void testBasic() {
    Photo photo = new Photo("test.jpg");
    repo.save(photo);

    Iterable<Photo> photos = repo.findAll();

    assertEquals(1, Iterables.toList(photos).size());
  }


}