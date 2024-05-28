package br.gov.pa.semas.portarias.web.rest;

import static br.gov.pa.semas.portarias.domain.PortariaAsserts.*;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.createUpdateProxyForBean;
import static br.gov.pa.semas.portarias.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.gov.pa.semas.portarias.IntegrationTest;
import br.gov.pa.semas.portarias.domain.Portaria;
import br.gov.pa.semas.portarias.repository.PortariaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
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
 * Integration tests for the {@link PortariaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PortariaResourceIT {

    private static final Long DEFAULT_NUMERO = 1L;
    private static final Long UPDATED_NUMERO = 2L;

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DELETED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DELETED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/portarias";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PortariaRepository portariaRepository;

    @Mock
    private PortariaRepository portariaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPortariaMockMvc;

    private Portaria portaria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Portaria createEntity(EntityManager em) {
        Portaria portaria = new Portaria()
            .numero(DEFAULT_NUMERO)
            .data(DEFAULT_DATA)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .deletedAt(DEFAULT_DELETED_AT);
        return portaria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Portaria createUpdatedEntity(EntityManager em) {
        Portaria portaria = new Portaria()
            .numero(UPDATED_NUMERO)
            .data(UPDATED_DATA)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);
        return portaria;
    }

    @BeforeEach
    public void initTest() {
        portaria = createEntity(em);
    }

    @Test
    @Transactional
    void createPortaria() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Portaria
        var returnedPortaria = om.readValue(
            restPortariaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(portaria)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Portaria.class
        );

        // Validate the Portaria in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPortariaUpdatableFieldsEquals(returnedPortaria, getPersistedPortaria(returnedPortaria));
    }

    @Test
    @Transactional
    void createPortariaWithExistingId() throws Exception {
        // Create the Portaria with an existing ID
        portaria.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPortariaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(portaria)))
            .andExpect(status().isBadRequest());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumeroIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        portaria.setNumero(null);

        // Create the Portaria, which fails.

        restPortariaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(portaria)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPortarias() throws Exception {
        // Initialize the database
        portariaRepository.saveAndFlush(portaria);

        // Get all the portariaList
        restPortariaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(portaria.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO.intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].deletedAt").value(hasItem(sameInstant(DEFAULT_DELETED_AT))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPortariasWithEagerRelationshipsIsEnabled() throws Exception {
        when(portariaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPortariaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(portariaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPortariasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(portariaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPortariaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(portariaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPortaria() throws Exception {
        // Initialize the database
        portariaRepository.saveAndFlush(portaria);

        // Get the portaria
        restPortariaMockMvc
            .perform(get(ENTITY_API_URL_ID, portaria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(portaria.getId().intValue()))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO.intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.deletedAt").value(sameInstant(DEFAULT_DELETED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingPortaria() throws Exception {
        // Get the portaria
        restPortariaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPortaria() throws Exception {
        // Initialize the database
        portariaRepository.saveAndFlush(portaria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the portaria
        Portaria updatedPortaria = portariaRepository.findById(portaria.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPortaria are not directly saved in db
        em.detach(updatedPortaria);
        updatedPortaria
            .numero(UPDATED_NUMERO)
            .data(UPDATED_DATA)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restPortariaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPortaria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPortaria))
            )
            .andExpect(status().isOk());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPortariaToMatchAllProperties(updatedPortaria);
    }

    @Test
    @Transactional
    void putNonExistingPortaria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        portaria.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPortariaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, portaria.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(portaria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPortaria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        portaria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortariaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(portaria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPortaria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        portaria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortariaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(portaria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePortariaWithPatch() throws Exception {
        // Initialize the database
        portariaRepository.saveAndFlush(portaria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the portaria using partial update
        Portaria partialUpdatedPortaria = new Portaria();
        partialUpdatedPortaria.setId(portaria.getId());

        partialUpdatedPortaria.numero(UPDATED_NUMERO).createdAt(UPDATED_CREATED_AT);

        restPortariaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPortaria.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPortaria))
            )
            .andExpect(status().isOk());

        // Validate the Portaria in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPortariaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPortaria, portaria), getPersistedPortaria(portaria));
    }

    @Test
    @Transactional
    void fullUpdatePortariaWithPatch() throws Exception {
        // Initialize the database
        portariaRepository.saveAndFlush(portaria);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the portaria using partial update
        Portaria partialUpdatedPortaria = new Portaria();
        partialUpdatedPortaria.setId(portaria.getId());

        partialUpdatedPortaria
            .numero(UPDATED_NUMERO)
            .data(UPDATED_DATA)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .deletedAt(UPDATED_DELETED_AT);

        restPortariaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPortaria.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPortaria))
            )
            .andExpect(status().isOk());

        // Validate the Portaria in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPortariaUpdatableFieldsEquals(partialUpdatedPortaria, getPersistedPortaria(partialUpdatedPortaria));
    }

    @Test
    @Transactional
    void patchNonExistingPortaria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        portaria.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPortariaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, portaria.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(portaria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPortaria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        portaria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortariaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(portaria))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPortaria() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        portaria.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortariaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(portaria)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Portaria in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePortaria() throws Exception {
        // Initialize the database
        portariaRepository.saveAndFlush(portaria);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the portaria
        restPortariaMockMvc
            .perform(delete(ENTITY_API_URL_ID, portaria.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return portariaRepository.count();
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

    protected Portaria getPersistedPortaria(Portaria portaria) {
        return portariaRepository.findById(portaria.getId()).orElseThrow();
    }

    protected void assertPersistedPortariaToMatchAllProperties(Portaria expectedPortaria) {
        assertPortariaAllPropertiesEquals(expectedPortaria, getPersistedPortaria(expectedPortaria));
    }

    protected void assertPersistedPortariaToMatchUpdatableProperties(Portaria expectedPortaria) {
        assertPortariaAllUpdatablePropertiesEquals(expectedPortaria, getPersistedPortaria(expectedPortaria));
    }
}
