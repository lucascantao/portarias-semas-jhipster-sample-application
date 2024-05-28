package br.gov.pa.semas.portarias.repository;

import br.gov.pa.semas.portarias.domain.Topico;
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
public class TopicoRepositoryWithBagRelationshipsImpl implements TopicoRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String TOPICOS_PARAMETER = "topicos";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Topico> fetchBagRelationships(Optional<Topico> topico) {
        return topico.map(this::fetchAjudas).map(this::fetchAssuntos);
    }

    @Override
    public Page<Topico> fetchBagRelationships(Page<Topico> topicos) {
        return new PageImpl<>(fetchBagRelationships(topicos.getContent()), topicos.getPageable(), topicos.getTotalElements());
    }

    @Override
    public List<Topico> fetchBagRelationships(List<Topico> topicos) {
        return Optional.of(topicos).map(this::fetchAjudas).map(this::fetchAssuntos).orElse(Collections.emptyList());
    }

    Topico fetchAjudas(Topico result) {
        return entityManager
            .createQuery("select topico from Topico topico left join fetch topico.ajudas where topico.id = :id", Topico.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Topico> fetchAjudas(List<Topico> topicos) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, topicos.size()).forEach(index -> order.put(topicos.get(index).getId(), index));
        List<Topico> result = entityManager
            .createQuery("select topico from Topico topico left join fetch topico.ajudas where topico in :topicos", Topico.class)
            .setParameter(TOPICOS_PARAMETER, topicos)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Topico fetchAssuntos(Topico result) {
        return entityManager
            .createQuery("select topico from Topico topico left join fetch topico.assuntos where topico.id = :id", Topico.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Topico> fetchAssuntos(List<Topico> topicos) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, topicos.size()).forEach(index -> order.put(topicos.get(index).getId(), index));
        List<Topico> result = entityManager
            .createQuery("select topico from Topico topico left join fetch topico.assuntos where topico in :topicos", Topico.class)
            .setParameter(TOPICOS_PARAMETER, topicos)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
