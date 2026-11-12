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
                java.time.LocalDate.now().minusYears(21),
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
                java.time.LocalDate.now().minusYears(22),
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
                (java.time.LocalDate) null,
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

    @Test
    @Order(9)
    void shouldRegisterTeenUserWithFlexibleDateFormatSuccessfully() throws Exception {
        // Rohit born 08-06-2010 (DD-MM-YYYY format, age 16)
        String payload = """
                {
                    "name": "Rohit",
                    "email": "rohit.teen@gmail.com",
                    "password": "validpassword123",
                    "dateOfBirth": "08-06-2010",
                    "city": "Delhi NCR"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("rohit.teen@gmail.com"))
                .andExpect(jsonPath("$.data.user.name").value("Rohit"))
                .andExpect(jsonPath("$.data.user.age").value(16))
                .andExpect(jsonPath("$.data.user.dateOfBirth").value("2010-06-08"));
    }

    @Test
    @Order(10)
    void shouldRegisterUserWithIsoDateFormatSuccessfully() throws Exception {
        String payload = """
                {
                    "name": "Rohit ISO",
                    "email": "rohit.iso@gmail.com",
                    "password": "validpassword123",
                    "dateOfBirth": "2010-06-08",
                    "city": "Delhi NCR"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.user.email").value("rohit.iso@gmail.com"))
                .andExpect(jsonPath("$.data.user.age").value(16));
    }

    @Test
    @Order(11)
    void shouldRejectRegistrationUnder13YearsOld() throws Exception {
        // Child born 5 years ago (under 13)
        java.time.LocalDate childDob = java.time.LocalDate.now().minusYears(5);
        String payload = String.format("""
                {
                    "name": "Child User",
                    "email": "child@student.edu",
                    "password": "validpassword123",
                    "dateOfBirth": "%s",
                    "city": "Delhi"
                }
                """, childDob);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", containsString("at least 13 years old")));
    }

    @Test
    @Order(12)
    void shouldRejectRegistrationWithFutureDate() throws Exception {
        java.time.LocalDate futureDob = java.time.LocalDate.now().plusDays(2);
        String payload = String.format("""
                {
                    "name": "Future User",
                    "email": "future@student.edu",
                    "password": "validpassword123",
                    "dateOfBirth": "%s",
                    "city": "Delhi"
                }
                """, futureDob);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @Order(13)
    void shouldRejectRegistrationWithMalformedDate() throws Exception {
        String payload = """
                {
                    "name": "Malformed Date User",
                    "email": "malformed.date@student.edu",
                    "password": "validpassword123",
                    "dateOfBirth": "not-a-valid-date",
                    "city": "Delhi"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", containsString("Invalid date of birth format")));
    }

    @Test
    @Order(14)
    void shouldRejectRegistrationWithMissingDob() throws Exception {
        String payload = """
                {
                    "name": "No DOB User",
                    "email": "nodob@student.edu",
                    "password": "validpassword123",
                    "city": "Delhi"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.dateOfBirth").exists());
    }

    @Test
    @Order(15)
    void shouldAllowCorsPreflightFromAnyLocalhostPort() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options("/api/auth/login")
                        .header("Origin", "http://localhost:5174")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Access-Control-Allow-Origin", "http://localhost:5174"));
    }

    @Test
    @Order(16)
    void shouldAllowCorsPostFromLocalhost5174() throws Exception {
        LoginRequest request = new LoginRequest("aarav@student.edu", "secret123");

        mockMvc.perform(post("/api/auth/login")
                        .header("Origin", "http://localhost:5174")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("Access-Control-Allow-Origin", "http://localhost:5174"));
    }
}
