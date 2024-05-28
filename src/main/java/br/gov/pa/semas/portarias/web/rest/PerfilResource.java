package br.gov.pa.semas.portarias.web.rest;

import br.gov.pa.semas.portarias.domain.Perfil;
import br.gov.pa.semas.portarias.repository.PerfilRepository;
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
 * REST controller for managing {@link br.gov.pa.semas.portarias.domain.Perfil}.
 */
@RestController
@RequestMapping("/api/perfils")
@Transactional
public class PerfilResource {

    private final Logger log = LoggerFactory.getLogger(PerfilResource.class);

    private static final String ENTITY_NAME = "perfil";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PerfilRepository perfilRepository;

    public PerfilResource(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    /**
     * {@code POST  /perfils} : Create a new perfil.
     *
     * @param perfil the perfil to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new perfil, or with status {@code 400 (Bad Request)} if the perfil has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Perfil> createPerfil(@Valid @RequestBody Perfil perfil) throws URISyntaxException {
        log.debug("REST request to save Perfil : {}", perfil);
        if (perfil.getId() != null) {
            throw new BadRequestAlertException("A new perfil cannot already have an ID", ENTITY_NAME, "idexists");
        }
        perfil = perfilRepository.save(perfil);
        return ResponseEntity.created(new URI("/api/perfils/" + perfil.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, perfil.getId().toString()))
            .body(perfil);
    }

    /**
     * {@code PUT  /perfils/:id} : Updates an existing perfil.
     *
     * @param id the id of the perfil to save.
     * @param perfil the perfil to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfil,
     * or with status {@code 400 (Bad Request)} if the perfil is not valid,
     * or with status {@code 500 (Internal Server Error)} if the perfil couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Perfil> updatePerfil(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Perfil perfil
    ) throws URISyntaxException {
        log.debug("REST request to update Perfil : {}, {}", id, perfil);
        if (perfil.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, perfil.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!perfilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        perfil = perfilRepository.save(perfil);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, perfil.getId().toString()))
            .body(perfil);
    }

    /**
     * {@code PATCH  /perfils/:id} : Partial updates given fields of an existing perfil, field will ignore if it is null
     *
     * @param id the id of the perfil to save.
     * @param perfil the perfil to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfil,
     * or with status {@code 400 (Bad Request)} if the perfil is not valid,
     * or with status {@code 404 (Not Found)} if the perfil is not found,
     * or with status {@code 500 (Internal Server Error)} if the perfil couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Perfil> partialUpdatePerfil(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Perfil perfil
    ) throws URISyntaxException {
        log.debug("REST request to partial update Perfil partially : {}, {}", id, perfil);
        if (perfil.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, perfil.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!perfilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Perfil> result = perfilRepository
            .findById(perfil.getId())
            .map(existingPerfil -> {
                if (perfil.getNome() != null) {
                    existingPerfil.setNome(perfil.getNome());
                }
                if (perfil.getDescricao() != null) {
                    existingPerfil.setDescricao(perfil.getDescricao());
                }
                if (perfil.getCreatedAt() != null) {
                    existingPerfil.setCreatedAt(perfil.getCreatedAt());
                }
                if (perfil.getUpdatedAt() != null) {
                    existingPerfil.setUpdatedAt(perfil.getUpdatedAt());
                }
                if (perfil.getDeletedAt() != null) {
                    existingPerfil.setDeletedAt(perfil.getDeletedAt());
                }

                return existingPerfil;
            })
            .map(perfilRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, perfil.getId().toString())
        );
    }

    /**
     * {@code GET  /perfils} : get all the perfils.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of perfils in body.
     */
    @GetMapping("")
    public List<Perfil> getAllPerfils() {
        log.debug("REST request to get all Perfils");
        return perfilRepository.findAll();
    }

    /**
     * {@code GET  /perfils/:id} : get the "id" perfil.
     *
     * @param id the id of the perfil to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the perfil, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Perfil> getPerfil(@PathVariable("id") Long id) {
        log.debug("REST request to get Perfil : {}", id);
        Optional<Perfil> perfil = perfilRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(perfil);
    }

    /**
     * {@code DELETE  /perfils/:id} : delete the "id" perfil.
     *
     * @param id the id of the perfil to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerfil(@PathVariable("id") Long id) {
        log.debug("REST request to delete Perfil : {}", id);
        perfilRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
