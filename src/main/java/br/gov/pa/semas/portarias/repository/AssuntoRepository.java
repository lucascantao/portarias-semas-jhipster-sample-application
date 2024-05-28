package br.gov.pa.semas.portarias.repository;

import br.gov.pa.semas.portarias.domain.Assunto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Assunto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssuntoRepository extends JpaRepository<Assunto, Long> {}
