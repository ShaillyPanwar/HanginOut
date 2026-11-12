package com.hanginout.activity;

import com.hanginout.common.security.JwtTokenProvider;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local-postgres")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:postgresql://localhost:5432/hanginout",
        "spring.datasource.username=postgres",
        "spring.datasource.password=000000"
})
class ActivitiesPostgresTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    private String testToken;

    @BeforeEach
    void setUp() {
        User user = userRepository.findByEmail("admin@hanginout.com")
                .orElseGet(() -> {
                    User newUser = new User("admin@hanginout.com", "$2a$10$abcdefghijklmnopqrstuvwxyz123456", "HanginOut Admin", LocalDate.of(1995, 1, 1), "Delhi", "ROLE_ADMIN");
                    return userRepository.save(newUser);
                });
        if (user.getDateOfBirth() == null) {
            user.setDateOfBirth(LocalDate.of(1995, 1, 1));
            user = userRepository.save(user);
        }
        testToken = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getName(), user.getRole());
    }

    @Test
    @DisplayName("Should fetch activities with null city on PostgreSQL without function lower(bytea) error")
    void shouldFetchActivitiesWithNullCityOnPostgres() throws Exception {
        mockMvc.perform(get("/api/activities?size=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("Should fetch recommended activities on PostgreSQL without lower(bytea) error when city is null")
    void shouldFetchRecommendationsWithNullCityOnPostgres() throws Exception {
        mockMvc.perform(get("/api/activities/recommended?size=25&latitude=28.7180&longitude=77.1130")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data[0].distanceKm").isNumber());
    }

    @Test
    @DisplayName("Should filter recommended activities within 1 km, 3 km, 5 km, and 50 km on PostgreSQL")
    void shouldFilterRecommendationsByDistanceRadiusOnPostgres() throws Exception {
        // 1. Within 1 km
        mockMvc.perform(get("/api/activities/recommended?size=25&latitude=28.7180&longitude=77.1130&maxDistanceKm=1")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[*].distanceKm", everyItem(lessThanOrEqualTo(1.0))));

        // 2. Within 3 km
        mockMvc.perform(get("/api/activities/recommended?size=25&latitude=28.7180&longitude=77.1130&maxDistanceKm=3")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[*].distanceKm", everyItem(lessThanOrEqualTo(3.0))));

        // 3. Within 5 km
        mockMvc.perform(get("/api/activities/recommended?size=25&latitude=28.7180&longitude=77.1130&maxDistanceKm=5")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[*].distanceKm", everyItem(lessThanOrEqualTo(5.0))));

        // 4. Within 50 km
        mockMvc.perform(get("/api/activities/recommended?size=25&latitude=28.7180&longitude=77.1130&maxDistanceKm=50")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[*].distanceKm", everyItem(lessThanOrEqualTo(50.0))));
    }

    @Test
    @DisplayName("Should fetch activities case-insensitively with uppercase and lowercase city")
    void shouldFetchActivitiesCaseInsensitive() throws Exception {
        // Lowercase
        mockMvc.perform(get("/api/activities?city=delhi&size=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[0].city").value(equalToIgnoringCase("Delhi")));

        // Uppercase
        mockMvc.perform(get("/api/activities?city=DELHI&size=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[0].city").value(equalToIgnoringCase("Delhi")));
    }

    @Test
    @DisplayName("Should handle empty string city as null filter")
    void shouldHandleEmptyCityAsNullFilter() throws Exception {
        mockMvc.perform(get("/api/activities?city=&size=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("Should filter activities by Delhi NCR zone on PostgreSQL")
    void shouldFilterActivitiesByZoneOnPostgres() throws Exception {
        // 1. South Delhi
        mockMvc.perform(get("/api/activities?zone=South Delhi&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.data.content[*].zone", everyItem(equalTo("South Delhi"))));

        // 2. Gurugram
        mockMvc.perform(get("/api/activities?zone=Gurugram&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.data.content[*].zone", everyItem(equalTo("Gurugram"))));

        // 3. Noida
        mockMvc.perform(get("/api/activities?zone=Noida&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.data.content[*].zone", everyItem(equalTo("Noida"))));
    }

    @Test
    @DisplayName("Should return balanced cross-zone activities when no zone is specified (All Delhi NCR)")
    void shouldReturnBalancedCrossZoneActivitiesForAllDelhiNcr() throws Exception {
        mockMvc.perform(get("/api/activities/recommended?size=20")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(10))))
                .andExpect(jsonPath("$.data[0].zone").isNotEmpty())
                .andExpect(jsonPath("$.data[0].areaFormatted").isNotEmpty());
    }

    @Test
    @DisplayName("Should filter recommendations by zone")
    void shouldFilterRecommendationsByZone() throws Exception {
        mockMvc.perform(get("/api/activities/recommended?zone=South Delhi&size=10")
                        .header("Authorization", "Bearer " + testToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.data[*].zone", everyItem(equalTo("South Delhi"))));
    }
}
