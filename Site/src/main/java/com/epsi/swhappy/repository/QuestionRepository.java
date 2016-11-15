package com.epsi.swhappy.repository;

import com.epsi.swhappy.domain.Question;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Question entity.
 */
@SuppressWarnings("unused")
public interface QuestionRepository extends JpaRepository<Question,Long> {
	
	//@Query("select distinct question from question question where question.surveys.id =:id")
	@Query(value = "SELECT * "
			+ "FROM question as question "
			+ "WHERE question.surveys_id = ?1 ", nativeQuery = true)
	List<Question> findQuestionsByIdSurvey(Long id);

}
