package br.gov.pa.semas.portarias.web.rest;

import static br.gov.pa.semas.portarias.domain.PerfilAsserts.*;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.createUpdateProxyForBean;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.gov.pa.semas.portarias.IntegrationTest;
import br.gov.pa.semas.portarias.domain.Perfil;
import br.gov.pa.semas.portarias.repository.PerfilRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PerfilResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PerfilResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DELETED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DELETED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/perfils";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPerfilMockMvc;

    private Perfil perfil;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Perfil createEntity(EntityManager em) {
        Perfil perfil = new Perfil()
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .deletedAt(DEFAULT_DELETED_AT);
        return perfil;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Perfil createUpdatedEntity(EntityManager em) {
        Perfil perfil = new Perfil()
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);
        return perfil;
    }

    @BeforeEach
    public void initTest() {
        perfil = createEntity(em);
    }

    @Test
    @Transactional
    void createPerfil() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Perfil
        var returnedPerfil = om.readValue(
            restPerfilMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(perfil)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Perfil.class
        );

        // Validate the Perfil in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPerfilUpdatableFieldsEquals(returnedPerfil, getPersistedPerfil(returnedPerfil));
    }

    @Test
    @Transactional
    void createPerfilWithExistingId() throws Exception {
        // Create the Perfil with an existing ID
        perfil.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPerfilMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(perfil)))
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        perfil.setNome(null);

        // Create the Perfil, which fails.

        restPerfilMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(perfil)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPerfils() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        // Get all the perfilList
        restPerfilMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(perfil.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(sameInstant(DEFAULT_DELETED_AT))));
    }

    @Test
    @Transactional
    void getPerfil() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        // Get the perfil
        restPerfilMockMvc
            .perform(get(ENTITY_API_URL_ID, perfil.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(perfil.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO.toString()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.deletedAt").value(sameInstant(DEFAULT_DELETED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingPerfil() throws Exception {
        // Get the perfil
        restPerfilMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPerfil() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the perfil
        Perfil updatedPerfil = perfilRepository.findById(perfil.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPerfil are not directly saved in db
        em.detach(updatedPerfil);
        updatedPerfil
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restPerfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPerfil.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPerfil))
            )
            .andExpect(status().isOk());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPerfilToMatchAllProperties(updatedPerfil);
    }

    @Test
    @Transactional
    void putNonExistingPerfil() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        perfil.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(put(ENTITY_API_URL_ID, perfil.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(perfil)))
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPerfil() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        perfil.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPerfil() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        perfil.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(perfil)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePerfilWithPatch() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the perfil using partial update
        Perfil partialUpdatedPerfil = new Perfil();
        partialUpdatedPerfil.setId(perfil.getId());

        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPerfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPerfil))
            )
            .andExpect(status().isOk());

        // Validate the Perfil in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPerfilUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPerfil, perfil), getPersistedPerfil(perfil));
    }

    @Test
    @Transactional
    void fullUpdatePerfilWithPatch() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the perfil using partial update
        Perfil partialUpdatedPerfil = new Perfil();
        partialUpdatedPerfil.setId(perfil.getId());

        partialUpdatedPerfil
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPerfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPerfil))
            )
            .andExpect(status().isOk());

        // Validate the Perfil in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPerfilUpdatableFieldsEquals(partialUpdatedPerfil, getPersistedPerfil(partialUpdatedPerfil));
    }

    @Test
    @Transactional
    void patchNonExistingPerfil() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        perfil.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, perfil.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPerfil() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        perfil.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPerfil() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        perfil.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(perfil)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Perfil in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePerfil() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the perfil
        restPerfilMockMvc
            .perform(delete(ENTITY_API_URL_ID, perfil.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return perfilRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Perfil getPersistedPerfil(Perfil perfil) {
        return perfilRepository.findById(perfil.getId()).orElseThrow();
    }

    protected void assertPersistedPerfilToMatchAllProperties(Perfil expectedPerfil) {
        assertPerfilAllPropertiesEquals(expectedPerfil, getPersistedPerfil(expectedPerfil));
    }

    protected void assertPersistedPerfilToMatchUpdatableProperties(Perfil expectedPerfil) {
        assertPerfilAllUpdatablePropertiesEquals(expectedPerfil, getPersistedPerfil(expectedPerfil));
    }
}
