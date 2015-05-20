package net.weverwijk.photo.graph.repo;

import org.neo4j.ogm.session.Session;
import org.neo4j.ogm.session.SessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.config.Neo4jConfiguration;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.data.neo4j.server.Neo4jServer;
import org.springframework.data.neo4j.server.RemoteServer;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableNeo4jRepositories("net.weverwijk.photo")
@EnableTransactionManagement
@ComponentScan("net.weverwijk.photo")
public class TestConfig extends Neo4jConfiguration {
  public static final int NEO4J_PORT = 7474;

  	@Override
  	public SessionFactory getSessionFactory() {
  		System.setProperty("username", "neo4j");
  		System.setProperty("password", "test");
  		return new SessionFactory("net.weverwijk.photo.graph");
  	}

  	@Bean
  	@Override
  	public Neo4jServer neo4jServer() {
  		return new RemoteServer("http://localhost:" + NEO4J_PORT);
  	}

  	@Bean
  	@Override
  	//@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
  	public Session getSession() throws Exception {
  		return super.getSession();
  	}
}