package com.epsi.swhappy.web.rest;

import com.epsi.swhappy.SwhappyApp;

import com.epsi.swhappy.domain.Question;
import com.epsi.swhappy.repository.QuestionRepository;

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
 * Test class for the QuestionResource REST controller.
 *
 * @see QuestionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SwhappyApp.class)
public class QuestionResourceIntTest {

    private static final String DEFAULT_LABEL = "AAAAA";
    private static final String UPDATED_LABEL = "BBBBB";

    private static final String DEFAULT_ANSWER_1 = "AAAAA";
    private static final String UPDATED_ANSWER_1 = "BBBBB";

    private static final String DEFAULT_ANSWER_2 = "AAAAA";
    private static final String UPDATED_ANSWER_2 = "BBBBB";

    private static final Integer DEFAULT_COUNTER_1 = 1;
    private static final Integer UPDATED_COUNTER_1 = 2;

    private static final Integer DEFAULT_COUNTER_2 = 1;
    private static final Integer UPDATED_COUNTER_2 = 2;

    @Inject
    private QuestionRepository questionRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Inject
    private EntityManager em;

    private MockMvc restQuestionMockMvc;

    private Question question;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QuestionResource questionResource = new QuestionResource();
        ReflectionTestUtils.setField(questionResource, "questionRepository", questionRepository);
        this.restQuestionMockMvc = MockMvcBuilders.standaloneSetup(questionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Question createEntity(EntityManager em) {
        Question question = new Question();
        question.setLabel(DEFAULT_LABEL);
        question.setAnswer1(DEFAULT_ANSWER_1);
        question.setAnswer2(DEFAULT_ANSWER_2);
        question.setCounter1(DEFAULT_COUNTER_1);
        question.setCounter2(DEFAULT_COUNTER_2);
        return question;
    }

    @Before
    public void initTest() {
        question = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestion() throws Exception {
        int databaseSizeBeforeCreate = questionRepository.findAll().size();

        // Create the Question

        restQuestionMockMvc.perform(post("/api/questions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(question)))
                .andExpect(status().isCreated());

        // Validate the Question in the database
        List<Question> questions = questionRepository.findAll();
        assertThat(questions).hasSize(databaseSizeBeforeCreate + 1);
        Question testQuestion = questions.get(questions.size() - 1);
        assertThat(testQuestion.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testQuestion.getAnswer1()).isEqualTo(DEFAULT_ANSWER_1);
        assertThat(testQuestion.getAnswer2()).isEqualTo(DEFAULT_ANSWER_2);
        assertThat(testQuestion.getCounter1()).isEqualTo(DEFAULT_COUNTER_1);
        assertThat(testQuestion.getCounter2()).isEqualTo(DEFAULT_COUNTER_2);
    }

    @Test
    @Transactional
    public void getAllQuestions() throws Exception {
        // Initialize the database
        questionRepository.saveAndFlush(question);

        // Get all the questions
        restQuestionMockMvc.perform(get("/api/questions?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(question.getId().intValue())))
                .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL.toString())))
                .andExpect(jsonPath("$.[*].answer1").value(hasItem(DEFAULT_ANSWER_1.toString())))
                .andExpect(jsonPath("$.[*].answer2").value(hasItem(DEFAULT_ANSWER_2.toString())))
                .andExpect(jsonPath("$.[*].counter1").value(hasItem(DEFAULT_COUNTER_1)))
                .andExpect(jsonPath("$.[*].counter2").value(hasItem(DEFAULT_COUNTER_2)));
    }

    @Test
    @Transactional
    public void getQuestion() throws Exception {
        // Initialize the database
        questionRepository.saveAndFlush(question);

        // Get the question
        restQuestionMockMvc.perform(get("/api/questions/{id}", question.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(question.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL.toString()))
            .andExpect(jsonPath("$.answer1").value(DEFAULT_ANSWER_1.toString()))
            .andExpect(jsonPath("$.answer2").value(DEFAULT_ANSWER_2.toString()))
            .andExpect(jsonPath("$.counter1").value(DEFAULT_COUNTER_1))
            .andExpect(jsonPath("$.counter2").value(DEFAULT_COUNTER_2));
    }

    @Test
    @Transactional
    public void getNonExistingQuestion() throws Exception {
        // Get the question
        restQuestionMockMvc.perform(get("/api/questions/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestion() throws Exception {
        // Initialize the database
        questionRepository.saveAndFlush(question);
        int databaseSizeBeforeUpdate = questionRepository.findAll().size();

        // Update the question
        Question updatedQuestion = questionRepository.findOne(question.getId());
        updatedQuestion.setLabel(UPDATED_LABEL);
        updatedQuestion.setAnswer1(UPDATED_ANSWER_1);
        updatedQuestion.setAnswer2(UPDATED_ANSWER_2);
        updatedQuestion.setCounter1(UPDATED_COUNTER_1);
        updatedQuestion.setCounter2(UPDATED_COUNTER_2);

        restQuestionMockMvc.perform(put("/api/questions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedQuestion)))
                .andExpect(status().isOk());

        // Validate the Question in the database
        List<Question> questions = questionRepository.findAll();
        assertThat(questions).hasSize(databaseSizeBeforeUpdate);
        Question testQuestion = questions.get(questions.size() - 1);
        assertThat(testQuestion.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testQuestion.getAnswer1()).isEqualTo(UPDATED_ANSWER_1);
        assertThat(testQuestion.getAnswer2()).isEqualTo(UPDATED_ANSWER_2);
        assertThat(testQuestion.getCounter1()).isEqualTo(UPDATED_COUNTER_1);
        assertThat(testQuestion.getCounter2()).isEqualTo(UPDATED_COUNTER_2);
    }

    @Test
    @Transactional
    public void deleteQuestion() throws Exception {
        // Initialize the database
        questionRepository.saveAndFlush(question);
        int databaseSizeBeforeDelete = questionRepository.findAll().size();

        // Get the question
        restQuestionMockMvc.perform(delete("/api/questions/{id}", question.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Question> questions = questionRepository.findAll();
        assertThat(questions).hasSize(databaseSizeBeforeDelete - 1);
    }
}
