package com.epsi.swhappy.service.dto;

import com.epsi.swhappy.config.Constants;

import com.epsi.swhappy.domain.Authority;
import com.epsi.swhappy.domain.Entreprise;
import com.epsi.swhappy.domain.Survey;
import com.epsi.swhappy.domain.User;

import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.*;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO {

    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    private String login;
    
    private int age;
    
    private int score;
    
    @Size(max = 50)
    private String sexe;

	@Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    private boolean activated = false;

    @Size(min = 2, max = 5)
    private String langKey;

    private Set<String> authorities;
    
    private Set<Survey> survey;
    
    private Entreprise entreprise;

    public UserDTO() {
    }

    public UserDTO(User user) {
        this(user.getLogin(), user.getFirstName(), user.getLastName(),
            user.getEmail(), user.getActivated(), user.getLangKey(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()), user.getScore(), user.getSexe(), user.getAge(), user.getSurvey(), user.getEntreprise());
    }

    public UserDTO(String login, String firstName, String lastName,
        String email, boolean activated, String langKey, Set<String> authorities, int score, String sexe, int age, Set<Survey> survey, Entreprise entreprise) {

        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activated = activated;
        this.langKey = langKey;
        this.authorities = authorities;
        this.score = score;
        this.sexe = sexe;
        this.age = age;
        this.survey = survey;
        this.entreprise = entreprise;
    }


	public String getLogin() {
        return login;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public boolean isActivated() {
        return activated;
    }

    public String getLangKey() {
        return langKey;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }
    
    public Set<Survey> getSurvey() {
        return survey;
    }
    
    public int getAge() {
		return age;
	}

	public int getScore() {
		return score;
	}

	public String getSexe() {
		return sexe;
	}
	
	public Entreprise getEntreprise(){
		return entreprise;
	}

    @Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", activated=" + activated +
            ", langKey='" + langKey + '\'' +
            ", authorities=" + authorities + '\'' +
            ", age=" + age + '\'' +
            ", sexe='" + sexe + '\'' +
            ", score=" + score +
            "}";
    }
}
