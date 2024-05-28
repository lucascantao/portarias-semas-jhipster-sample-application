package br.gov.pa.semas.portarias.repository;

import br.gov.pa.semas.portarias.domain.Ajuda;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class AjudaRepositoryWithBagRelationshipsImpl implements AjudaRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String AJUDAS_PARAMETER = "ajudas";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Ajuda> fetchBagRelationships(Optional<Ajuda> ajuda) {
        return ajuda.map(this::fetchAjudas);
    }

    @Override
    public Page<Ajuda> fetchBagRelationships(Page<Ajuda> ajudas) {
        return new PageImpl<>(fetchBagRelationships(ajudas.getContent()), ajudas.getPageable(), ajudas.getTotalElements());
    }

    @Override
    public List<Ajuda> fetchBagRelationships(List<Ajuda> ajudas) {
        return Optional.of(ajudas).map(this::fetchAjudas).orElse(Collections.emptyList());
    }

    Ajuda fetchAjudas(Ajuda result) {
        return entityManager
            .createQuery("select ajuda from Ajuda ajuda left join fetch ajuda.ajudas where ajuda.id = :id", Ajuda.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Ajuda> fetchAjudas(List<Ajuda> ajudas) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, ajudas.size()).forEach(index -> order.put(ajudas.get(index).getId(), index));
        List<Ajuda> result = entityManager
            .createQuery("select ajuda from Ajuda ajuda left join fetch ajuda.ajudas where ajuda in :ajudas", Ajuda.class)
            .setParameter(AJUDAS_PARAMETER, ajudas)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
