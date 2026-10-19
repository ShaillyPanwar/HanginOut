package com.hanginout.user.dto;

import com.hanginout.user.entity.User;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private Integer age;
    private String city;
    private String role;
    private LocalDateTime createdAt;

    public UserDTO() {}

    public UserDTO(Long id, String email, String name, Integer age, String city, String role, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.age = age;
        this.city = city;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserDTO fromEntity(User user) {
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAge(),
                user.getCity(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
