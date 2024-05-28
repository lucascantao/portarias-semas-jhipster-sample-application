package br.gov.pa.semas.portarias.web.rest;

import br.gov.pa.semas.portarias.domain.Portaria;
import br.gov.pa.semas.portarias.repository.PortariaRepository;
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
 * REST controller for managing {@link br.gov.pa.semas.portarias.domain.Portaria}.
 */
@RestController
@RequestMapping("/api/portarias")
@Transactional
public class PortariaResource {

    private final Logger log = LoggerFactory.getLogger(PortariaResource.class);

    private static final String ENTITY_NAME = "portaria";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PortariaRepository portariaRepository;

    public PortariaResource(PortariaRepository portariaRepository) {
        this.portariaRepository = portariaRepository;
    }

    /**
     * {@code POST  /portarias} : Create a new portaria.
     *
     * @param portaria the portaria to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new portaria, or with status {@code 400 (Bad Request)} if the portaria has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Portaria> createPortaria(@Valid @RequestBody Portaria portaria) throws URISyntaxException {
        log.debug("REST request to save Portaria : {}", portaria);
        if (portaria.getId() != null) {
            throw new BadRequestAlertException("A new portaria cannot already have an ID", ENTITY_NAME, "idexists");
        }
        portaria = portariaRepository.save(portaria);
        return ResponseEntity.created(new URI("/api/portarias/" + portaria.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, portaria.getId().toString()))
            .body(portaria);
    }

    /**
     * {@code PUT  /portarias/:id} : Updates an existing portaria.
     *
     * @param id the id of the portaria to save.
     * @param portaria the portaria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated portaria,
     * or with status {@code 400 (Bad Request)} if the portaria is not valid,
     * or with status {@code 500 (Internal Server Error)} if the portaria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Portaria> updatePortaria(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Portaria portaria
    ) throws URISyntaxException {
        log.debug("REST request to update Portaria : {}, {}", id, portaria);
        if (portaria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, portaria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!portariaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        portaria = portariaRepository.save(portaria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, portaria.getId().toString()))
            .body(portaria);
    }

    /**
     * {@code PATCH  /portarias/:id} : Partial updates given fields of an existing portaria, field will ignore if it is null
     *
     * @param id the id of the portaria to save.
     * @param portaria the portaria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated portaria,
     * or with status {@code 400 (Bad Request)} if the portaria is not valid,
     * or with status {@code 404 (Not Found)} if the portaria is not found,
     * or with status {@code 500 (Internal Server Error)} if the portaria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Portaria> partialUpdatePortaria(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Portaria portaria
    ) throws URISyntaxException {
        log.debug("REST request to partial update Portaria partially : {}, {}", id, portaria);
        if (portaria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, portaria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!portariaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Portaria> result = portariaRepository
            .findById(portaria.getId())
            .map(existingPortaria -> {
                if (portaria.getNumero() != null) {
                    existingPortaria.setNumero(portaria.getNumero());
                }
                if (portaria.getData() != null) {
                    existingPortaria.setData(portaria.getData());
                }
                if (portaria.getCreatedAt() != null) {
                    existingPortaria.setCreatedAt(portaria.getCreatedAt());
                }
                if (portaria.getUpdatedAt() != null) {
                    existingPortaria.setUpdatedAt(portaria.getUpdatedAt());
                }
                if (portaria.getDeletedAt() != null) {
                    existingPortaria.setDeletedAt(portaria.getDeletedAt());
                }

                return existingPortaria;
            })
            .map(portariaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, portaria.getId().toString())
        );
    }

    /**
     * {@code GET  /portarias} : get all the portarias.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of portarias in body.
     */
    @GetMapping("")
    public List<Portaria> getAllPortarias(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Portarias");
        if (eagerload) {
            return portariaRepository.findAllWithEagerRelationships();
        } else {
            return portariaRepository.findAll();
        }
    }

    /**
     * {@code GET  /portarias/:id} : get the "id" portaria.
     *
     * @param id the id of the portaria to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the portaria, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Portaria> getPortaria(@PathVariable("id") Long id) {
        log.debug("REST request to get Portaria : {}", id);
        Optional<Portaria> portaria = portariaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(portaria);
    }

    /**
     * {@code DELETE  /portarias/:id} : delete the "id" portaria.
     *
     * @param id the id of the portaria to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortaria(@PathVariable("id") Long id) {
        log.debug("REST request to delete Portaria : {}", id);
        portariaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
