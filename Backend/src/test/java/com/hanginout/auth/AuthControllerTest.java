package com.hanginout.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanginout.auth.dto.LoginRequest;
import com.hanginout.auth.dto.RegisterRequest;
import com.hanginout.user.dto.UpdateProfileRequest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String jwtToken;

    @Test
    @Order(1)
    void shouldRegisterNewUserSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Aarav Sharma",
                "aarav@student.edu",
                "secret123",
                21,
                "Delhi"
        );

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.user.email").value("aarav@student.edu"))
                .andExpect(jsonPath("$.data.user.name").value("Aarav Sharma"))
                .andExpect(jsonPath("$.data.user.city").value("Delhi"))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(responseBody).path("data").path("token").asText();
    }

    @Test
    @Order(2)
    void shouldRejectDuplicateEmailRegistration() throws Exception {
        RegisterRequest duplicate = new RegisterRequest(
                "Aarav Clone",
                "aarav@student.edu",
                "password999",
                22,
                "Delhi"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    @Order(3)
    void shouldRejectInvalidRegistrationData() throws Exception {
        RegisterRequest invalid = new RegisterRequest(
                "", // Blank name
                "not-an-email",
                "123", // Short password < 6 chars
                null,
                null
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    @Order(4)
    void shouldLoginSuccessfullyWithValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("aarav@student.edu", "secret123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("aarav@student.edu"));
    }

    @Test
    @Order(5)
    void shouldRejectLoginWithIncorrectPassword() throws Exception {
        LoginRequest request = new LoginRequest("aarav@student.edu", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @Order(6)
    void shouldFetchCurrentUserProfileWithValidJwt() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.email").value("aarav@student.edu"))
                .andExpect(jsonPath("$.data.name").value("Aarav Sharma"))
                .andExpect(jsonPath("$.data.age").value(21));
    }

    @Test
    @Order(7)
    void shouldRejectProfileRequestWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(8)
    void shouldUpdateCurrentUserProfile() throws Exception {
        UpdateProfileRequest update = new UpdateProfileRequest("Aarav S.", 22, "Noida");

        mockMvc.perform(put("/api/users/me")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.name").value("Aarav S."))
                .andExpect(jsonPath("$.data.age").value(22))
                .andExpect(jsonPath("$.data.city").value("Noida"));
    }
}
