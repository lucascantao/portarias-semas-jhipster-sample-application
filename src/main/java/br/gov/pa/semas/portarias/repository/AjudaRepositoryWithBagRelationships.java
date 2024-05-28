package br.gov.pa.semas.portarias.repository;

import br.gov.pa.semas.portarias.domain.Ajuda;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface AjudaRepositoryWithBagRelationships {
    Optional<Ajuda> fetchBagRelationships(Optional<Ajuda> ajuda);

    List<Ajuda> fetchBagRelationships(List<Ajuda> ajudas);

    Page<Ajuda> fetchBagRelationships(Page<Ajuda> ajudas);
}
