package com.epsi.swhappy.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "label")
    private String label;

    @Column(name = "answer_1")
    private String answer1;

    @Column(name = "answer_2")
    private String answer2;

    @Column(name = "counter_1")
    private Integer counter1;

    @Column(name = "counter_2")
    private Integer counter2;

    @ManyToOne
    private Survey surveys;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getAnswer1() {
        return answer1;
    }

    public void setAnswer1(String answer1) {
        this.answer1 = answer1;
    }

    public String getAnswer2() {
        return answer2;
    }

    public void setAnswer2(String answer2) {
        this.answer2 = answer2;
    }

    public Integer getCounter1() {
        return counter1;
    }

    public void setCounter1(Integer counter1) {
        this.counter1 = counter1;
    }

    public Integer getCounter2() {
        return counter2;
    }

    public void setCounter2(Integer counter2) {
        this.counter2 = counter2;
    }

    public Survey getSurveys() {
        return surveys;
    }

    public void setSurveys(Survey survey) {
        this.surveys = survey;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Question question = (Question) o;
        if(question.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, question.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Question{" +
            "id=" + id +
            ", label='" + label + "'" +
            ", answer1='" + answer1 + "'" +
            ", answer2='" + answer2 + "'" +
            ", counter1='" + counter1 + "'" +
            ", counter2='" + counter2 + "'" +
            '}';
    }
}
