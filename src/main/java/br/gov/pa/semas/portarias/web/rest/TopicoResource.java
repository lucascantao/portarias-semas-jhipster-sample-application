package br.gov.pa.semas.portarias.web.rest;

import br.gov.pa.semas.portarias.domain.Topico;
import br.gov.pa.semas.portarias.repository.TopicoRepository;
import br.gov.pa.semas.portarias.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.gov.pa.semas.portarias.domain.Topico}.
 */
@RestController
@RequestMapping("/api/topicos")
@Transactional
public class TopicoResource {

    private final Logger log = LoggerFactory.getLogger(TopicoResource.class);

    private static final String ENTITY_NAME = "topico";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TopicoRepository topicoRepository;

    public TopicoResource(TopicoRepository topicoRepository) {
        this.topicoRepository = topicoRepository;
    }

    /**
     * {@code POST  /topicos} : Create a new topico.
     *
     * @param topico the topico to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new topico, or with status {@code 400 (Bad Request)} if the topico has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Topico> createTopico(@Valid @RequestBody Topico topico) throws URISyntaxException {
        log.debug("REST request to save Topico : {}", topico);
        if (topico.getId() != null) {
            throw new BadRequestAlertException("A new topico cannot already have an ID", ENTITY_NAME, "idexists");
        }
        topico = topicoRepository.save(topico);
        return ResponseEntity.created(new URI("/api/topicos/" + topico.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, topico.getId().toString()))
            .body(topico);
    }

    /**
     * {@code PUT  /topicos/:id} : Updates an existing topico.
     *
     * @param id the id of the topico to save.
     * @param topico the topico to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated topico,
     * or with status {@code 400 (Bad Request)} if the topico is not valid,
     * or with status {@code 500 (Internal Server Error)} if the topico couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Topico> updateTopico(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody Topico topico
    ) throws URISyntaxException {
        log.debug("REST request to update Topico : {}, {}", id, topico);
        if (topico.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, topico.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!topicoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        topico = topicoRepository.save(topico);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, topico.getId().toString()))
            .body(topico);
    }

    /**
     * {@code PATCH  /topicos/:id} : Partial updates given fields of an existing topico, field will ignore if it is null
     *
     * @param id the id of the topico to save.
     * @param topico the topico to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated topico,
     * or with status {@code 400 (Bad Request)} if the topico is not valid,
     * or with status {@code 404 (Not Found)} if the topico is not found,
     * or with status {@code 500 (Internal Server Error)} if the topico couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Topico> partialUpdateTopico(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Topico topico
    ) throws URISyntaxException {
        log.debug("REST request to partial update Topico partially : {}, {}", id, topico);
        if (topico.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, topico.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!topicoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Topico> result = topicoRepository
            .findById(topico.getId())
            .map(existingTopico -> {
                if (topico.getTitulo() != null) {
                    existingTopico.setTitulo(topico.getTitulo());
                }

                return existingTopico;
            })
            .map(topicoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, topico.getId().toString())
        );
    }

    /**
     * {@code GET  /topicos} : get all the topicos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of topicos in body.
     */
    @GetMapping("")
    public List<Topico> getAllTopicos(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Topicos");
        if (eagerload) {
            return topicoRepository.findAllWithEagerRelationships();
        } else {
            return topicoRepository.findAll();
        }
    }

    /**
     * {@code GET  /topicos/:id} : get the "id" topico.
     *
     * @param id the id of the topico to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the topico, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Topico> getTopico(@PathVariable("id") UUID id) {
        log.debug("REST request to get Topico : {}", id);
        Optional<Topico> topico = topicoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(topico);
    }

    /**
     * {@code DELETE  /topicos/:id} : delete the "id" topico.
     *
     * @param id the id of the topico to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopico(@PathVariable("id") UUID id) {
        log.debug("REST request to delete Topico : {}", id);
        topicoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
