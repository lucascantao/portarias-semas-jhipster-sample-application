package br.gov.pa.semas.portarias.repository;

import br.gov.pa.semas.portarias.domain.Ajuda;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Ajuda entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AjudaRepository extends JpaRepository<Ajuda, UUID> {}
