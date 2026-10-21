package com.hanginout.activity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

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

    @Test
    @DisplayName("Should fetch activities with null city on PostgreSQL without function lower(bytea) error")
    void shouldFetchActivitiesWithNullCityOnPostgres() throws Exception {
        mockMvc.perform(get("/api/activities?size=20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))));
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
}
