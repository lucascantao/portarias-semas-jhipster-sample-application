package br.gov.pa.semas.portarias.web.rest;

import br.gov.pa.semas.portarias.domain.Setor;
import br.gov.pa.semas.portarias.repository.SetorRepository;
import br.gov.pa.semas.portarias.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.gov.pa.semas.portarias.domain.Setor}.
 */
@RestController
@RequestMapping("/api/setors")
@Transactional
public class SetorResource {

    private final Logger log = LoggerFactory.getLogger(SetorResource.class);

    private static final String ENTITY_NAME = "setor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SetorRepository setorRepository;

    public SetorResource(SetorRepository setorRepository) {
        this.setorRepository = setorRepository;
    }

    /**
     * {@code POST  /setors} : Create a new setor.
     *
     * @param setor the setor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new setor, or with status {@code 400 (Bad Request)} if the setor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Setor> createSetor(@Valid @RequestBody Setor setor) throws URISyntaxException {
        log.debug("REST request to save Setor : {}", setor);
        if (setor.getId() != null) {
            throw new BadRequestAlertException("A new setor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        setor = setorRepository.save(setor);
        return ResponseEntity.created(new URI("/api/setors/" + setor.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, setor.getId().toString()))
            .body(setor);
    }

    /**
     * {@code PUT  /setors/:id} : Updates an existing setor.
     *
     * @param id the id of the setor to save.
     * @param setor the setor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated setor,
     * or with status {@code 400 (Bad Request)} if the setor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the setor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Setor> updateSetor(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Setor setor)
        throws URISyntaxException {
        log.debug("REST request to update Setor : {}, {}", id, setor);
        if (setor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, setor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!setorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        setor = setorRepository.save(setor);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, setor.getId().toString()))
            .body(setor);
    }

    /**
     * {@code PATCH  /setors/:id} : Partial updates given fields of an existing setor, field will ignore if it is null
     *
     * @param id the id of the setor to save.
     * @param setor the setor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated setor,
     * or with status {@code 400 (Bad Request)} if the setor is not valid,
     * or with status {@code 404 (Not Found)} if the setor is not found,
     * or with status {@code 500 (Internal Server Error)} if the setor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Setor> partialUpdateSetor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Setor setor
    ) throws URISyntaxException {
        log.debug("REST request to partial update Setor partially : {}, {}", id, setor);
        if (setor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, setor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!setorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Setor> result = setorRepository
            .findById(setor.getId())
            .map(existingSetor -> {
                if (setor.getNome() != null) {
                    existingSetor.setNome(setor.getNome());
                }
                if (setor.getSigla() != null) {
                    existingSetor.setSigla(setor.getSigla());
                }
                if (setor.getCreatedAt() != null) {
                    existingSetor.setCreatedAt(setor.getCreatedAt());
                }
                if (setor.getUpdatedAt() != null) {
                    existingSetor.setUpdatedAt(setor.getUpdatedAt());
                }
                if (setor.getDeletedAt() != null) {
                    existingSetor.setDeletedAt(setor.getDeletedAt());
                }

                return existingSetor;
            })
            .map(setorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, setor.getId().toString())
        );
    }

    /**
     * {@code GET  /setors} : get all the setors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of setors in body.
     */
    @GetMapping("")
    public List<Setor> getAllSetors() {
        log.debug("REST request to get all Setors");
        return setorRepository.findAll();
    }

    /**
     * {@code GET  /setors/:id} : get the "id" setor.
     *
     * @param id the id of the setor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the setor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Setor> getSetor(@PathVariable("id") Long id) {
        log.debug("REST request to get Setor : {}", id);
        Optional<Setor> setor = setorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(setor);
    }

    /**
     * {@code DELETE  /setors/:id} : delete the "id" setor.
     *
     * @param id the id of the setor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSetor(@PathVariable("id") Long id) {
        log.debug("REST request to delete Setor : {}", id);
        setorRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
