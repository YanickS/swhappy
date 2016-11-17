package com.epsi.swhappy.web.rest;

import com.epsi.swhappy.SwhappyApp;

import com.epsi.swhappy.domain.Entreprise;
import com.epsi.swhappy.repository.EntrepriseRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EntrepriseResource REST controller.
 *
 * @see EntrepriseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SwhappyApp.class)
public class EntrepriseResourceIntTest {

    private static final String DEFAULT_SIRET = "AAAAA";
    private static final String UPDATED_SIRET = "BBBBB";

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    private static final String DEFAULT_ACTIVITY = "AAAAA";
    private static final String UPDATED_ACTIVITY = "BBBBB";

    private static final String DEFAULT_CITY = "AAAAA";
    private static final String UPDATED_CITY = "BBBBB";

    @Inject
    private EntrepriseRepository entrepriseRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Inject
    private EntityManager em;

    private MockMvc restEntrepriseMockMvc;

    private Entreprise entreprise;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        EntrepriseResource entrepriseResource = new EntrepriseResource();
        ReflectionTestUtils.setField(entrepriseResource, "entrepriseRepository", entrepriseRepository);
        this.restEntrepriseMockMvc = MockMvcBuilders.standaloneSetup(entrepriseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Entreprise createEntity(EntityManager em) {
        Entreprise entreprise = new Entreprise()
                .siret(DEFAULT_SIRET)
                .name(DEFAULT_NAME)
                .activity(DEFAULT_ACTIVITY)
                .city(DEFAULT_CITY);
        return entreprise;
    }

    @Before
    public void initTest() {
        entreprise = createEntity(em);
    }

    @Test
    @Transactional
    public void createEntreprise() throws Exception {
        int databaseSizeBeforeCreate = entrepriseRepository.findAll().size();

        // Create the Entreprise

        restEntrepriseMockMvc.perform(post("/api/entreprises")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(entreprise)))
                .andExpect(status().isCreated());

        // Validate the Entreprise in the database
        List<Entreprise> entreprises = entrepriseRepository.findAll();
        assertThat(entreprises).hasSize(databaseSizeBeforeCreate + 1);
        Entreprise testEntreprise = entreprises.get(entreprises.size() - 1);
        assertThat(testEntreprise.getSiret()).isEqualTo(DEFAULT_SIRET);
        assertThat(testEntreprise.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEntreprise.getActivity()).isEqualTo(DEFAULT_ACTIVITY);
        assertThat(testEntreprise.getCity()).isEqualTo(DEFAULT_CITY);
    }

    @Test
    @Transactional
    public void getAllEntreprises() throws Exception {
        // Initialize the database
        entrepriseRepository.saveAndFlush(entreprise);

        // Get all the entreprises
        restEntrepriseMockMvc.perform(get("/api/entreprises?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(entreprise.getId().intValue())))
                .andExpect(jsonPath("$.[*].siret").value(hasItem(DEFAULT_SIRET.toString())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].activity").value(hasItem(DEFAULT_ACTIVITY.toString())))
                .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())));
    }

    @Test
    @Transactional
    public void getEntreprise() throws Exception {
        // Initialize the database
        entrepriseRepository.saveAndFlush(entreprise);

        // Get the entreprise
        restEntrepriseMockMvc.perform(get("/api/entreprises/{id}", entreprise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(entreprise.getId().intValue()))
            .andExpect(jsonPath("$.siret").value(DEFAULT_SIRET.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.activity").value(DEFAULT_ACTIVITY.toString()))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEntreprise() throws Exception {
        // Get the entreprise
        restEntrepriseMockMvc.perform(get("/api/entreprises/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEntreprise() throws Exception {
        // Initialize the database
        entrepriseRepository.saveAndFlush(entreprise);
        int databaseSizeBeforeUpdate = entrepriseRepository.findAll().size();

        // Update the entreprise
        Entreprise updatedEntreprise = entrepriseRepository.findOne(entreprise.getId());
        updatedEntreprise
                .siret(UPDATED_SIRET)
                .name(UPDATED_NAME)
                .activity(UPDATED_ACTIVITY)
                .city(UPDATED_CITY);

        restEntrepriseMockMvc.perform(put("/api/entreprises")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedEntreprise)))
                .andExpect(status().isOk());

        // Validate the Entreprise in the database
        List<Entreprise> entreprises = entrepriseRepository.findAll();
        assertThat(entreprises).hasSize(databaseSizeBeforeUpdate);
        Entreprise testEntreprise = entreprises.get(entreprises.size() - 1);
        assertThat(testEntreprise.getSiret()).isEqualTo(UPDATED_SIRET);
        assertThat(testEntreprise.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEntreprise.getActivity()).isEqualTo(UPDATED_ACTIVITY);
        assertThat(testEntreprise.getCity()).isEqualTo(UPDATED_CITY);
    }

    @Test
    @Transactional
    public void deleteEntreprise() throws Exception {
        // Initialize the database
        entrepriseRepository.saveAndFlush(entreprise);
        int databaseSizeBeforeDelete = entrepriseRepository.findAll().size();

        // Get the entreprise
        restEntrepriseMockMvc.perform(delete("/api/entreprises/{id}", entreprise.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Entreprise> entreprises = entrepriseRepository.findAll();
        assertThat(entreprises).hasSize(databaseSizeBeforeDelete - 1);
    }
}
