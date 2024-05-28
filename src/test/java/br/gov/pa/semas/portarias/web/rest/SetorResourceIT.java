package br.gov.pa.semas.portarias.web.rest;

import static br.gov.pa.semas.portarias.domain.SetorAsserts.*;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.createUpdateProxyForBean;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.gov.pa.semas.portarias.IntegrationTest;
import br.gov.pa.semas.portarias.domain.Setor;
import br.gov.pa.semas.portarias.repository.SetorRepository;
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
 * Integration tests for the {@link SetorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SetorResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_SIGLA = "AAAAAAAAAA";
    private static final String UPDATED_SIGLA = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DELETED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DELETED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/setors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SetorRepository setorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSetorMockMvc;

    private Setor setor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Setor createEntity(EntityManager em) {
        Setor setor = new Setor()
            .nome(DEFAULT_NOME)
            .sigla(DEFAULT_SIGLA)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .deletedAt(DEFAULT_DELETED_AT);
        return setor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Setor createUpdatedEntity(EntityManager em) {
        Setor setor = new Setor()
            .nome(UPDATED_NOME)
            .sigla(UPDATED_SIGLA)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);
        return setor;
    }

    @BeforeEach
    public void initTest() {
        setor = createEntity(em);
    }

    @Test
    @Transactional
    void createSetor() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Setor
        var returnedSetor = om.readValue(
            restSetorMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(setor)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Setor.class
        );

        // Validate the Setor in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSetorUpdatableFieldsEquals(returnedSetor, getPersistedSetor(returnedSetor));
    }

    @Test
    @Transactional
    void createSetorWithExistingId() throws Exception {
        // Create the Setor with an existing ID
        setor.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSetorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(setor)))
            .andExpect(status().isBadRequest());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        setor.setNome(null);

        // Create the Setor, which fails.

        restSetorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(setor)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSiglaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        setor.setSigla(null);

        // Create the Setor, which fails.

        restSetorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(setor)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSetors() throws Exception {
        // Initialize the database
        setorRepository.saveAndFlush(setor);

        // Get all the setorList
        restSetorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(setor.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].sigla").value(hasItem(DEFAULT_SIGLA)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(sameInstant(DEFAULT_DELETED_AT))));
    }

    @Test
    @Transactional
    void getSetor() throws Exception {
        // Initialize the database
        setorRepository.saveAndFlush(setor);

        // Get the setor
        restSetorMockMvc
            .perform(get(ENTITY_API_URL_ID, setor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(setor.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.sigla").value(DEFAULT_SIGLA))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.deletedAt").value(sameInstant(DEFAULT_DELETED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingSetor() throws Exception {
        // Get the setor
        restSetorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSetor() throws Exception {
        // Initialize the database
        setorRepository.saveAndFlush(setor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the setor
        Setor updatedSetor = setorRepository.findById(setor.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSetor are not directly saved in db
        em.detach(updatedSetor);
        updatedSetor
            .nome(UPDATED_NOME)
            .sigla(UPDATED_SIGLA)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restSetorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSetor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSetor))
            )
            .andExpect(status().isOk());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSetorToMatchAllProperties(updatedSetor);
    }

    @Test
    @Transactional
    void putNonExistingSetor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        setor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSetorMockMvc
            .perform(put(ENTITY_API_URL_ID, setor.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(setor)))
            .andExpect(status().isBadRequest());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSetor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        setor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSetorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(setor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSetor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        setor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSetorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(setor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSetorWithPatch() throws Exception {
        // Initialize the database
        setorRepository.saveAndFlush(setor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the setor using partial update
        Setor partialUpdatedSetor = new Setor();
        partialUpdatedSetor.setId(setor.getId());

        partialUpdatedSetor.nome(UPDATED_NOME).updatedAt(UPDATED_UPDATED_AT);

        restSetorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSetor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSetor))
            )
            .andExpect(status().isOk());

        // Validate the Setor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSetorUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSetor, setor), getPersistedSetor(setor));
    }

    @Test
    @Transactional
    void fullUpdateSetorWithPatch() throws Exception {
        // Initialize the database
        setorRepository.saveAndFlush(setor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the setor using partial update
        Setor partialUpdatedSetor = new Setor();
        partialUpdatedSetor.setId(setor.getId());

        partialUpdatedSetor
            .nome(UPDATED_NOME)
            .sigla(UPDATED_SIGLA)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restSetorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSetor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSetor))
            )
            .andExpect(status().isOk());

        // Validate the Setor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSetorUpdatableFieldsEquals(partialUpdatedSetor, getPersistedSetor(partialUpdatedSetor));
    }

    @Test
    @Transactional
    void patchNonExistingSetor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        setor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSetorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, setor.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(setor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSetor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        setor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSetorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(setor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSetor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        setor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSetorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(setor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Setor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSetor() throws Exception {
        // Initialize the database
        setorRepository.saveAndFlush(setor);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the setor
        restSetorMockMvc
            .perform(delete(ENTITY_API_URL_ID, setor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return setorRepository.count();
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

    protected Setor getPersistedSetor(Setor setor) {
        return setorRepository.findById(setor.getId()).orElseThrow();
    }

    protected void assertPersistedSetorToMatchAllProperties(Setor expectedSetor) {
        assertSetorAllPropertiesEquals(expectedSetor, getPersistedSetor(expectedSetor));
    }

    protected void assertPersistedSetorToMatchUpdatableProperties(Setor expectedSetor) {
        assertSetorAllUpdatablePropertiesEquals(expectedSetor, getPersistedSetor(expectedSetor));
    }
}
