package br.gov.pa.semas.portarias.repository;

import br.gov.pa.semas.portarias.domain.Portaria;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Portaria entity.
 */
@Repository
public interface PortariaRepository extends JpaRepository<Portaria, Long> {
    default Optional<Portaria> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Portaria> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Portaria> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select portaria from Portaria portaria left join fetch portaria.assunto left join fetch portaria.setor left join fetch portaria.usuario left join fetch portaria.updatedBy left join fetch portaria.deletedBy",
        countQuery = "select count(portaria) from Portaria portaria"
    )
    Page<Portaria> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select portaria from Portaria portaria left join fetch portaria.assunto left join fetch portaria.setor left join fetch portaria.usuario left join fetch portaria.updatedBy left join fetch portaria.deletedBy"
    )
    List<Portaria> findAllWithToOneRelationships();

    @Query(
        "select portaria from Portaria portaria left join fetch portaria.assunto left join fetch portaria.setor left join fetch portaria.usuario left join fetch portaria.updatedBy left join fetch portaria.deletedBy where portaria.id =:id"
    )
    Optional<Portaria> findOneWithToOneRelationships(@Param("id") Long id);
}
