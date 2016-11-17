package com.epsi.swhappy.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.epsi.swhappy.domain.Question;
import com.epsi.swhappy.domain.Survey;
import com.epsi.swhappy.repository.QuestionRepository;
import com.epsi.swhappy.repository.SurveyRepository;
import com.epsi.swhappy.repository.UserRepository;
import com.epsi.swhappy.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Survey.
 */
@RestController
@RequestMapping("/api")
public class SurveyResource {

    private final Logger log = LoggerFactory.getLogger(SurveyResource.class);
        
    @Inject
    private SurveyRepository surveyRepository;
    
    @Inject
    private UserRepository userRepository;
    
    @Inject
    private QuestionRepository questionRepository;

    /**
     * POST  /surveys : Create a new survey.
     *
     * @param survey the survey to create
     * @return the ResponseEntity with status 201 (Created) and with body the new survey, or with status 400 (Bad Request) if the survey has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/surveys")
    @Timed
    public ResponseEntity<Survey> createSurvey(@RequestBody Survey survey) throws URISyntaxException {
        log.debug("REST request to save Survey : {}", survey);
        if (survey.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("survey", "idexists", "A new survey cannot already have an ID")).body(null);
        }
        Survey result = surveyRepository.save(survey);
        return ResponseEntity.created(new URI("/api/surveys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("survey", result.getId().toString()))
            .body(result);
    }
    
    /**
     * POST  /surveys : Create a new survey.
     *
     * @param survey the survey to create
     * @return 
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/surveys/{idSurvey}/completeby/{idUser}")
    @Timed
    public void completeSurvey(@PathVariable long idSurvey, @PathVariable long idUser) throws URISyntaxException {
        log.debug("REST request complete");
        try{
        	 surveyRepository.completeSurveyByUser(idSurvey, idUser);
        	 Survey survey = surveyRepository.findOne(idSurvey);
        	 userRepository.upScore(survey.getPoints(), idUser);
        } catch (Exception e){
        	log.debug("error");
        }
       
    }

    /**
     * PUT  /surveys : Updates an existing survey.
     *
     * @param survey the survey to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated survey,
     * or with status 400 (Bad Request) if the survey is not valid,
     * or with status 500 (Internal Server Error) if the survey couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/surveys")
    @Timed
    public ResponseEntity<Survey> updateSurvey(@RequestBody Survey survey) throws URISyntaxException {
        log.debug("REST request to update Survey : {}", survey);
        if (survey.getId() == null) {
            return createSurvey(survey);
        }
        Survey result = surveyRepository.save(survey);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("survey", survey.getId().toString()))
            .body(result);
    }

    /**
     * GET  /surveys : get all the surveys.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of surveys in body
     */
    @GetMapping("/surveys")
    @Timed
    public List<Survey> getAllSurveys() {
        log.debug("REST request to get all Surveys");
        List<Survey> surveys = surveyRepository.findAll();
        return surveys;
    }

    /**
     * GET  /surveys/:id : get the "id" survey.
     *
     * @param id the id of the survey to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the survey, or with status 404 (Not Found)
     */
    @GetMapping("/surveys/{id}")
    @Timed
    public ResponseEntity<Survey> getSurvey(@PathVariable Long id) {
        log.debug("REST request to get Survey : {}", id);
        Survey survey = surveyRepository.findOne(id);
        return Optional.ofNullable(survey)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * GET  /surveys/:id : get the "id" survey.
     *
     * @param id the id of the survey to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the survey, or with status 404 (Not Found)
     */
    @GetMapping("/surveys/entreprise/{id}")
    @Timed
    public List<Survey> getSurveyByEntrepriseId(@PathVariable Long id) {
        log.debug("REST request to get Survey : {}", id);
        List<Survey> lstSurvey = surveyRepository.findAllByEntrepriseId(id);
        return lstSurvey;
    }
    
    /**
     * GET  /surveys/:id : get the "id" survey.
     *
     * @param id the id of the survey to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the survey, or with status 404 (Not Found)
     */
    @GetMapping("/surveys/user/{id}")
    @Timed
    public List<Survey> getSurveyByUserId(@PathVariable Long id) {
        log.debug("REST request to get Survey : {}", id);
        List<Survey> lstSurvey = surveyRepository.findAllByUserId(id);
        return lstSurvey;
    }

    /**
     * DELETE  /surveys/:id : delete the "id" survey.
     *
     * @param id the id of the survey to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/surveys/{id}")
    @Timed
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        log.debug("REST request to delete Survey : {}", id);
        List<Question> questions = questionRepository.findQuestionsByIdSurvey(id);
        if(!questions.isEmpty()){
        	for(Question q : questions){
        		questionRepository.delete(q.getId());
        	}
        }
        surveyRepository.deleteForUser(id);
        surveyRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("survey", id.toString())).build();
    }

}
