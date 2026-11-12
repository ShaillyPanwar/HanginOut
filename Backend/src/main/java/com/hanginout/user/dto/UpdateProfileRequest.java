package com.hanginout.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hanginout.common.util.FlexibleLocalDateDeserializer;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UpdateProfileRequest {

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Past(message = "Date of birth must be in the past")
    @JsonDeserialize(using = FlexibleLocalDateDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Min(value = 13, message = "Minimum age is 13")
    @Max(value = 120, message = "Invalid age")
    private Integer age;

    @Size(max = 100, message = "City name cannot exceed 100 characters")
    private String city;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String name, Integer age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }

    public UpdateProfileRequest(String name, LocalDate dateOfBirth, String city) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.city = city;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
