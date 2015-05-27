package net.weverwijk.photo.graph.repo;

import net.weverwijk.photo.graph.model.Lens;
import net.weverwijk.photo.graph.model.Photo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.neo4j.helpers.collection.Iterables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = {TestConfig.class})
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class PhotoRepositoryTest {

  @Autowired
  PhotoRepository repo;

  @Test
  public void testBasic() {
    long numberOfPhotosBefore = repo.count();

    Lens testLens = new Lens("testLens");
    Photo photo = new Photo("test.jpg", testLens);

    repo.save(photo);

    long numberOfPhotosAfter = repo.count();

    assertEquals(numberOfPhotosBefore + 1, numberOfPhotosAfter);
  }

  @Test
  public void findByName() {
    List<Photo> photos = repo.findByFileName("150321-IMG_7029.jpg");

    assertEquals(2, Iterables.count(photos));

    Photo first = Iterables.first(photos);
    assertEquals("150321-IMG_7029.jpg", first.getFileName());
    assertTrue(first.getDirectory().startsWith("2015/korfbal/Fortissimo_viko_zaal/jpg"));
  }

  @Test
  public void testLensRelationship() {
    List<Photo> photos = repo.findByFileName("150321-IMG_7029.jpg");
    Photo photo = Iterables.first(photos);
    assertNotNull(photo.getLens());
    assertEquals("Canon EF 70-200mm f/4L", photo.getLens().getName());
  }


}