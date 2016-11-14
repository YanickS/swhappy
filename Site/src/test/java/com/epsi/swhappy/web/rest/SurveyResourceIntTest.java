package com.epsi.swhappy.web.rest;

import com.epsi.swhappy.SwhappyApp;

import com.epsi.swhappy.domain.Survey;
import com.epsi.swhappy.repository.SurveyRepository;

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
 * Test class for the SurveyResource REST controller.
 *
 * @see SurveyResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SwhappyApp.class)
public class SurveyResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAA";
    private static final String UPDATED_TITLE = "BBBBB";

    private static final String DEFAULT_TYPE = "AAAAA";
    private static final String UPDATED_TYPE = "BBBBB";

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    private static final String DEFAULT_PROMO = "AAAAA";
    private static final String UPDATED_PROMO = "BBBBB";

    @Inject
    private SurveyRepository surveyRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Inject
    private EntityManager em;

    private MockMvc restSurveyMockMvc;

    private Survey survey;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SurveyResource surveyResource = new SurveyResource();
        ReflectionTestUtils.setField(surveyResource, "surveyRepository", surveyRepository);
        this.restSurveyMockMvc = MockMvcBuilders.standaloneSetup(surveyResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Survey createEntity(EntityManager em) {
        Survey survey = new Survey();
        survey.setTitle(DEFAULT_TITLE);
        survey.setType(DEFAULT_TYPE);
        survey.setPoints(DEFAULT_POINTS);
        survey.setPromo(DEFAULT_PROMO);
        return survey;
    }

    @Before
    public void initTest() {
        survey = createEntity(em);
    }

    @Test
    @Transactional
    public void createSurvey() throws Exception {
        int databaseSizeBeforeCreate = surveyRepository.findAll().size();

        // Create the Survey

        restSurveyMockMvc.perform(post("/api/surveys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(survey)))
                .andExpect(status().isCreated());

        // Validate the Survey in the database
        List<Survey> surveys = surveyRepository.findAll();
        assertThat(surveys).hasSize(databaseSizeBeforeCreate + 1);
        Survey testSurvey = surveys.get(surveys.size() - 1);
        assertThat(testSurvey.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testSurvey.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testSurvey.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testSurvey.getPromo()).isEqualTo(DEFAULT_PROMO);
    }

    @Test
    @Transactional
    public void getAllSurveys() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        // Get all the surveys
        restSurveyMockMvc.perform(get("/api/surveys?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(survey.getId().intValue())))
                .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
                .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
                .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
                .andExpect(jsonPath("$.[*].promo").value(hasItem(DEFAULT_PROMO.toString())));
    }

    @Test
    @Transactional
    public void getSurvey() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        // Get the survey
        restSurveyMockMvc.perform(get("/api/surveys/{id}", survey.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(survey.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS))
            .andExpect(jsonPath("$.promo").value(DEFAULT_PROMO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSurvey() throws Exception {
        // Get the survey
        restSurveyMockMvc.perform(get("/api/surveys/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSurvey() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey
        Survey updatedSurvey = surveyRepository.findOne(survey.getId());
        updatedSurvey.setTitle(UPDATED_TITLE);
        updatedSurvey.setType(UPDATED_TYPE);
        updatedSurvey.setPoints(UPDATED_POINTS);
        updatedSurvey.setPromo(UPDATED_PROMO);

        restSurveyMockMvc.perform(put("/api/surveys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedSurvey)))
                .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveys = surveyRepository.findAll();
        assertThat(surveys).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveys.get(surveys.size() - 1);
        assertThat(testSurvey.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSurvey.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testSurvey.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testSurvey.getPromo()).isEqualTo(UPDATED_PROMO);
    }

    @Test
    @Transactional
    public void deleteSurvey() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);
        int databaseSizeBeforeDelete = surveyRepository.findAll().size();

        // Get the survey
        restSurveyMockMvc.perform(delete("/api/surveys/{id}", survey.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Survey> surveys = surveyRepository.findAll();
        assertThat(surveys).hasSize(databaseSizeBeforeDelete - 1);
    }
}
