package br.gov.pa.semas.portarias.web.rest;

import static br.gov.pa.semas.portarias.domain.AssuntoAsserts.*;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.createUpdateProxyForBean;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.gov.pa.semas.portarias.IntegrationTest;
import br.gov.pa.semas.portarias.domain.Assunto;
import br.gov.pa.semas.portarias.repository.AssuntoRepository;
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
 * Integration tests for the {@link AssuntoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AssuntoResourceIT {

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

    private static final String ENTITY_API_URL = "/api/assuntos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AssuntoRepository assuntoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssuntoMockMvc;

    private Assunto assunto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assunto createEntity(EntityManager em) {
        Assunto assunto = new Assunto()
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .deletedAt(DEFAULT_DELETED_AT);
        return assunto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assunto createUpdatedEntity(EntityManager em) {
        Assunto assunto = new Assunto()
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);
        return assunto;
    }

    @BeforeEach
    public void initTest() {
        assunto = createEntity(em);
    }

    @Test
    @Transactional
    void createAssunto() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Assunto
        var returnedAssunto = om.readValue(
            restAssuntoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(assunto)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Assunto.class
        );

        // Validate the Assunto in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAssuntoUpdatableFieldsEquals(returnedAssunto, getPersistedAssunto(returnedAssunto));
    }

    @Test
    @Transactional
    void createAssuntoWithExistingId() throws Exception {
        // Create the Assunto with an existing ID
        assunto.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssuntoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(assunto)))
            .andExpect(status().isBadRequest());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        assunto.setNome(null);

        // Create the Assunto, which fails.

        restAssuntoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(assunto)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAssuntos() throws Exception {
        // Initialize the database
        assuntoRepository.saveAndFlush(assunto);

        // Get all the assuntoList
        restAssuntoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assunto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(sameInstant(DEFAULT_DELETED_AT))));
    }

    @Test
    @Transactional
    void getAssunto() throws Exception {
        // Initialize the database
        assuntoRepository.saveAndFlush(assunto);

        // Get the assunto
        restAssuntoMockMvc
            .perform(get(ENTITY_API_URL_ID, assunto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(assunto.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO.toString()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.deletedAt").value(sameInstant(DEFAULT_DELETED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingAssunto() throws Exception {
        // Get the assunto
        restAssuntoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAssunto() throws Exception {
        // Initialize the database
        assuntoRepository.saveAndFlush(assunto);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the assunto
        Assunto updatedAssunto = assuntoRepository.findById(assunto.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAssunto are not directly saved in db
        em.detach(updatedAssunto);
        updatedAssunto
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restAssuntoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAssunto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAssunto))
            )
            .andExpect(status().isOk());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAssuntoToMatchAllProperties(updatedAssunto);
    }

    @Test
    @Transactional
    void putNonExistingAssunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        assunto.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssuntoMockMvc
            .perform(put(ENTITY_API_URL_ID, assunto.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(assunto)))
            .andExpect(status().isBadRequest());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAssunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        assunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuntoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(assunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAssunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        assunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuntoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(assunto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAssuntoWithPatch() throws Exception {
        // Initialize the database
        assuntoRepository.saveAndFlush(assunto);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the assunto using partial update
        Assunto partialUpdatedAssunto = new Assunto();
        partialUpdatedAssunto.setId(assunto.getId());

        partialUpdatedAssunto.descricao(UPDATED_DESCRICAO).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restAssuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssunto.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAssunto))
            )
            .andExpect(status().isOk());

        // Validate the Assunto in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAssuntoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAssunto, assunto), getPersistedAssunto(assunto));
    }

    @Test
    @Transactional
    void fullUpdateAssuntoWithPatch() throws Exception {
        // Initialize the database
        assuntoRepository.saveAndFlush(assunto);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the assunto using partial update
        Assunto partialUpdatedAssunto = new Assunto();
        partialUpdatedAssunto.setId(assunto.getId());

        partialUpdatedAssunto
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restAssuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssunto.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAssunto))
            )
            .andExpect(status().isOk());

        // Validate the Assunto in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAssuntoUpdatableFieldsEquals(partialUpdatedAssunto, getPersistedAssunto(partialUpdatedAssunto));
    }

    @Test
    @Transactional
    void patchNonExistingAssunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        assunto.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, assunto.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(assunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAssunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        assunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(assunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAssunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        assunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssuntoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(assunto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Assunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAssunto() throws Exception {
        // Initialize the database
        assuntoRepository.saveAndFlush(assunto);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the assunto
        restAssuntoMockMvc
            .perform(delete(ENTITY_API_URL_ID, assunto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return assuntoRepository.count();
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

    protected Assunto getPersistedAssunto(Assunto assunto) {
        return assuntoRepository.findById(assunto.getId()).orElseThrow();
    }

    protected void assertPersistedAssuntoToMatchAllProperties(Assunto expectedAssunto) {
        assertAssuntoAllPropertiesEquals(expectedAssunto, getPersistedAssunto(expectedAssunto));
    }

    protected void assertPersistedAssuntoToMatchUpdatableProperties(Assunto expectedAssunto) {
        assertAssuntoAllUpdatablePropertiesEquals(expectedAssunto, getPersistedAssunto(expectedAssunto));
    }
}
