package br.gov.pa.semas.portarias.web.rest;

import static br.gov.pa.semas.portarias.domain.AjudaAsserts.*;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.gov.pa.semas.portarias.IntegrationTest;
import br.gov.pa.semas.portarias.domain.Ajuda;
import br.gov.pa.semas.portarias.repository.AjudaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AjudaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AjudaResourceIT {

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ajudas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AjudaRepository ajudaRepository;

    @Mock
    private AjudaRepository ajudaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAjudaMockMvc;

    private Ajuda ajuda;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ajuda createEntity(EntityManager em) {
        Ajuda ajuda = new Ajuda().titulo(DEFAULT_TITULO);
        return ajuda;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ajuda createUpdatedEntity(EntityManager em) {
        Ajuda ajuda = new Ajuda().titulo(UPDATED_TITULO);
        return ajuda;
    }

    @BeforeEach
    public void initTest() {
        ajuda = createEntity(em);
    }

    @Test
    @Transactional
    void createAjuda() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Ajuda
        var returnedAjuda = om.readValue(
            restAjudaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ajuda)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Ajuda.class
        );

        // Validate the Ajuda in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAjudaUpdatableFieldsEquals(returnedAjuda, getPersistedAjuda(returnedAjuda));
    }

    @Test
    @Transactional
    void createAjudaWithExistingId() throws Exception {
        // Create the Ajuda with an existing ID
        ajudaRepository.saveAndFlush(ajuda);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAjudaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ajuda)))
            .andExpect(status().isBadRequest());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTituloIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ajuda.setTitulo(null);

        // Create the Ajuda, which fails.

        restAjudaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ajuda)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAjudas() throws Exception {
        // Initialize the database
        ajudaRepository.saveAndFlush(ajuda);

        // Get all the ajudaList
        restAjudaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ajuda.getId().toString())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAjudasWithEagerRelationshipsIsEnabled() throws Exception {
        when(ajudaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAjudaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ajudaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAjudasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(ajudaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAjudaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(ajudaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAjuda() throws Exception {
        // Initialize the database
        ajudaRepository.saveAndFlush(ajuda);

        // Get the ajuda
        restAjudaMockMvc
            .perform(get(ENTITY_API_URL_ID, ajuda.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ajuda.getId().toString()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO));
    }

    @Test
    @Transactional
    void getNonExistingAjuda() throws Exception {
        // Get the ajuda
        restAjudaMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAjuda() throws Exception {
        // Initialize the database
        ajudaRepository.saveAndFlush(ajuda);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ajuda
        Ajuda updatedAjuda = ajudaRepository.findById(ajuda.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAjuda are not directly saved in db
        em.detach(updatedAjuda);
        updatedAjuda.titulo(UPDATED_TITULO);

        restAjudaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAjuda.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAjuda))
            )
            .andExpect(status().isOk());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAjudaToMatchAllProperties(updatedAjuda);
    }

    @Test
    @Transactional
    void putNonExistingAjuda() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ajuda.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAjudaMockMvc
            .perform(put(ENTITY_API_URL_ID, ajuda.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ajuda)))
            .andExpect(status().isBadRequest());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAjuda() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ajuda.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAjudaMockMvc
            .perform(put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ajuda)))
            .andExpect(status().isBadRequest());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAjuda() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ajuda.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAjudaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ajuda)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAjudaWithPatch() throws Exception {
        // Initialize the database
        ajudaRepository.saveAndFlush(ajuda);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ajuda using partial update
        Ajuda partialUpdatedAjuda = new Ajuda();
        partialUpdatedAjuda.setId(ajuda.getId());

        partialUpdatedAjuda.titulo(UPDATED_TITULO);

        restAjudaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAjuda.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAjuda))
            )
            .andExpect(status().isOk());

        // Validate the Ajuda in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAjudaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAjuda, ajuda), getPersistedAjuda(ajuda));
    }

    @Test
    @Transactional
    void fullUpdateAjudaWithPatch() throws Exception {
        // Initialize the database
        ajudaRepository.saveAndFlush(ajuda);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ajuda using partial update
        Ajuda partialUpdatedAjuda = new Ajuda();
        partialUpdatedAjuda.setId(ajuda.getId());

        partialUpdatedAjuda.titulo(UPDATED_TITULO);

        restAjudaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAjuda.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAjuda))
            )
            .andExpect(status().isOk());

        // Validate the Ajuda in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAjudaUpdatableFieldsEquals(partialUpdatedAjuda, getPersistedAjuda(partialUpdatedAjuda));
    }

    @Test
    @Transactional
    void patchNonExistingAjuda() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ajuda.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAjudaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ajuda.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ajuda))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAjuda() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ajuda.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAjudaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ajuda))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAjuda() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ajuda.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAjudaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ajuda)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ajuda in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAjuda() throws Exception {
        // Initialize the database
        ajudaRepository.saveAndFlush(ajuda);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ajuda
        restAjudaMockMvc
            .perform(delete(ENTITY_API_URL_ID, ajuda.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ajudaRepository.count();
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

    protected Ajuda getPersistedAjuda(Ajuda ajuda) {
        return ajudaRepository.findById(ajuda.getId()).orElseThrow();
    }

    protected void assertPersistedAjudaToMatchAllProperties(Ajuda expectedAjuda) {
        assertAjudaAllPropertiesEquals(expectedAjuda, getPersistedAjuda(expectedAjuda));
    }

    protected void assertPersistedAjudaToMatchUpdatableProperties(Ajuda expectedAjuda) {
        assertAjudaAllUpdatablePropertiesEquals(expectedAjuda, getPersistedAjuda(expectedAjuda));
    }
}
