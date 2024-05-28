package br.gov.pa.semas.portarias.web.rest;

import br.gov.pa.semas.portarias.domain.Ajuda;
import br.gov.pa.semas.portarias.repository.AjudaRepository;
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
 * REST controller for managing {@link br.gov.pa.semas.portarias.domain.Ajuda}.
 */
@RestController
@RequestMapping("/api/ajudas")
@Transactional
public class AjudaResource {

    private final Logger log = LoggerFactory.getLogger(AjudaResource.class);

    private static final String ENTITY_NAME = "ajuda";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AjudaRepository ajudaRepository;

    public AjudaResource(AjudaRepository ajudaRepository) {
        this.ajudaRepository = ajudaRepository;
    }

    /**
     * {@code POST  /ajudas} : Create a new ajuda.
     *
     * @param ajuda the ajuda to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ajuda, or with status {@code 400 (Bad Request)} if the ajuda has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Ajuda> createAjuda(@Valid @RequestBody Ajuda ajuda) throws URISyntaxException {
        log.debug("REST request to save Ajuda : {}", ajuda);
        if (ajuda.getId() != null) {
            throw new BadRequestAlertException("A new ajuda cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ajuda = ajudaRepository.save(ajuda);
        return ResponseEntity.created(new URI("/api/ajudas/" + ajuda.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ajuda.getId().toString()))
            .body(ajuda);
    }

    /**
     * {@code PUT  /ajudas/:id} : Updates an existing ajuda.
     *
     * @param id the id of the ajuda to save.
     * @param ajuda the ajuda to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ajuda,
     * or with status {@code 400 (Bad Request)} if the ajuda is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ajuda couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ajuda> updateAjuda(@PathVariable(value = "id", required = false) final UUID id, @Valid @RequestBody Ajuda ajuda)
        throws URISyntaxException {
        log.debug("REST request to update Ajuda : {}, {}", id, ajuda);
        if (ajuda.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ajuda.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ajudaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ajuda = ajudaRepository.save(ajuda);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ajuda.getId().toString()))
            .body(ajuda);
    }

    /**
     * {@code PATCH  /ajudas/:id} : Partial updates given fields of an existing ajuda, field will ignore if it is null
     *
     * @param id the id of the ajuda to save.
     * @param ajuda the ajuda to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ajuda,
     * or with status {@code 400 (Bad Request)} if the ajuda is not valid,
     * or with status {@code 404 (Not Found)} if the ajuda is not found,
     * or with status {@code 500 (Internal Server Error)} if the ajuda couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ajuda> partialUpdateAjuda(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Ajuda ajuda
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ajuda partially : {}, {}", id, ajuda);
        if (ajuda.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ajuda.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ajudaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ajuda> result = ajudaRepository
            .findById(ajuda.getId())
            .map(existingAjuda -> {
                if (ajuda.getTitulo() != null) {
                    existingAjuda.setTitulo(ajuda.getTitulo());
                }

                return existingAjuda;
            })
            .map(ajudaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ajuda.getId().toString())
        );
    }

    /**
     * {@code GET  /ajudas} : get all the ajudas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ajudas in body.
     */
    @GetMapping("")
    public List<Ajuda> getAllAjudas() {
        log.debug("REST request to get all Ajudas");
        return ajudaRepository.findAll();
    }

    /**
     * {@code GET  /ajudas/:id} : get the "id" ajuda.
     *
     * @param id the id of the ajuda to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ajuda, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ajuda> getAjuda(@PathVariable("id") UUID id) {
        log.debug("REST request to get Ajuda : {}", id);
        Optional<Ajuda> ajuda = ajudaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ajuda);
    }

    /**
     * {@code DELETE  /ajudas/:id} : delete the "id" ajuda.
     *
     * @param id the id of the ajuda to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAjuda(@PathVariable("id") UUID id) {
        log.debug("REST request to delete Ajuda : {}", id);
        ajudaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
