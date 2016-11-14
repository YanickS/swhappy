package com.epsi.swhappy.repository;

import com.epsi.swhappy.domain.Survey;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Survey entity.
 */
@SuppressWarnings("unused")
public interface SurveyRepository extends JpaRepository<Survey,Long> {

}
