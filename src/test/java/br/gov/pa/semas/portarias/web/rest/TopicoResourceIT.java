package br.gov.pa.semas.portarias.web.rest;

import static br.gov.pa.semas.portarias.domain.TopicoAsserts.*;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.gov.pa.semas.portarias.IntegrationTest;
import br.gov.pa.semas.portarias.domain.Topico;
import br.gov.pa.semas.portarias.repository.TopicoRepository;
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
 * Integration tests for the {@link TopicoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TopicoResourceIT {

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/topicos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TopicoRepository topicoRepository;

    @Mock
    private TopicoRepository topicoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTopicoMockMvc;

    private Topico topico;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Topico createEntity(EntityManager em) {
        Topico topico = new Topico().titulo(DEFAULT_TITULO);
        return topico;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Topico createUpdatedEntity(EntityManager em) {
        Topico topico = new Topico().titulo(UPDATED_TITULO);
        return topico;
    }

    @BeforeEach
    public void initTest() {
        topico = createEntity(em);
    }

    @Test
    @Transactional
    void createTopico() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Topico
        var returnedTopico = om.readValue(
            restTopicoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(topico)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Topico.class
        );

        // Validate the Topico in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTopicoUpdatableFieldsEquals(returnedTopico, getPersistedTopico(returnedTopico));
    }

    @Test
    @Transactional
    void createTopicoWithExistingId() throws Exception {
        // Create the Topico with an existing ID
        topicoRepository.saveAndFlush(topico);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTopicoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(topico)))
            .andExpect(status().isBadRequest());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTituloIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        topico.setTitulo(null);

        // Create the Topico, which fails.

        restTopicoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(topico)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTopicos() throws Exception {
        // Initialize the database
        topicoRepository.saveAndFlush(topico);

        // Get all the topicoList
        restTopicoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(topico.getId().toString())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTopicosWithEagerRelationshipsIsEnabled() throws Exception {
        when(topicoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTopicoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(topicoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTopicosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(topicoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTopicoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(topicoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTopico() throws Exception {
        // Initialize the database
        topicoRepository.saveAndFlush(topico);

        // Get the topico
        restTopicoMockMvc
            .perform(get(ENTITY_API_URL_ID, topico.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(topico.getId().toString()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO));
    }

    @Test
    @Transactional
    void getNonExistingTopico() throws Exception {
        // Get the topico
        restTopicoMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTopico() throws Exception {
        // Initialize the database
        topicoRepository.saveAndFlush(topico);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the topico
        Topico updatedTopico = topicoRepository.findById(topico.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTopico are not directly saved in db
        em.detach(updatedTopico);
        updatedTopico.titulo(UPDATED_TITULO);

        restTopicoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTopico.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTopico))
            )
            .andExpect(status().isOk());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTopicoToMatchAllProperties(updatedTopico);
    }

    @Test
    @Transactional
    void putNonExistingTopico() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        topico.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTopicoMockMvc
            .perform(put(ENTITY_API_URL_ID, topico.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(topico)))
            .andExpect(status().isBadRequest());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTopico() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        topico.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTopicoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(topico))
            )
            .andExpect(status().isBadRequest());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTopico() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        topico.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTopicoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(topico)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTopicoWithPatch() throws Exception {
        // Initialize the database
        topicoRepository.saveAndFlush(topico);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the topico using partial update
        Topico partialUpdatedTopico = new Topico();
        partialUpdatedTopico.setId(topico.getId());

        partialUpdatedTopico.titulo(UPDATED_TITULO);

        restTopicoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTopico.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTopico))
            )
            .andExpect(status().isOk());

        // Validate the Topico in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTopicoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTopico, topico), getPersistedTopico(topico));
    }

    @Test
    @Transactional
    void fullUpdateTopicoWithPatch() throws Exception {
        // Initialize the database
        topicoRepository.saveAndFlush(topico);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the topico using partial update
        Topico partialUpdatedTopico = new Topico();
        partialUpdatedTopico.setId(topico.getId());

        partialUpdatedTopico.titulo(UPDATED_TITULO);

        restTopicoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTopico.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTopico))
            )
            .andExpect(status().isOk());

        // Validate the Topico in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTopicoUpdatableFieldsEquals(partialUpdatedTopico, getPersistedTopico(partialUpdatedTopico));
    }

    @Test
    @Transactional
    void patchNonExistingTopico() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        topico.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTopicoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, topico.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(topico))
            )
            .andExpect(status().isBadRequest());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTopico() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        topico.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTopicoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(topico))
            )
            .andExpect(status().isBadRequest());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTopico() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        topico.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTopicoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(topico)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Topico in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTopico() throws Exception {
        // Initialize the database
        topicoRepository.saveAndFlush(topico);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the topico
        restTopicoMockMvc
            .perform(delete(ENTITY_API_URL_ID, topico.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return topicoRepository.count();
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

    protected Topico getPersistedTopico(Topico topico) {
        return topicoRepository.findById(topico.getId()).orElseThrow();
    }

    protected void assertPersistedTopicoToMatchAllProperties(Topico expectedTopico) {
        assertTopicoAllPropertiesEquals(expectedTopico, getPersistedTopico(expectedTopico));
    }

    protected void assertPersistedTopicoToMatchUpdatableProperties(Topico expectedTopico) {
        assertTopicoAllUpdatablePropertiesEquals(expectedTopico, getPersistedTopico(expectedTopico));
    }
}
