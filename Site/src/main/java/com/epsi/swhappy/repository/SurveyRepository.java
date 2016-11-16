package com.epsi.swhappy.repository;

import com.epsi.swhappy.domain.Survey;

import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data JPA repository for the Survey entity.
 */
@SuppressWarnings("unused")
public interface SurveyRepository extends JpaRepository<Survey,Long> {
	
	@Query(value = "SELECT * "
			+ "FROM survey as survey "
			+ "WHERE survey.entreprise_id = ?1 ", nativeQuery = true)
	List<Survey> findAllByEntrepriseId(Long id);

	@Query(value = "Select * "
			+ "From survey "
			+ "Where id NOT IN ( "
				+ "Select us.survey_id "
				+ "From user_survey as us "
				+ "Where user_id = ?1 "
			+")", nativeQuery = true)
	List<Survey> findAllByUserId(Long id);

	@Query(value = "INSERT INTO user_survey (user_id, survey_id) VALUES (?2, ?1)", nativeQuery = true)
	@Modifying
	@Transactional
	void completeSurveyByUder(long idSurvey, long idUser);

	@Query(value = "DELETE FROM user_survey WHERE survey_id=?1", nativeQuery = true)
	@Modifying
	@Transactional
	void deleteForUser(Long id);

}
