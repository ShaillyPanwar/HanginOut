package com.hanginout.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class SecurityAndHealthTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/health should be publicly accessible without authentication")
    void testGetApiHealthPubliclyAccessible() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("hanginout-backend"))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    @DisplayName("GET /actuator/health should be publicly accessible without authentication")
    void testGetActuatorHealthPubliclyAccessible() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    @DisplayName("GET / should be rejected with 403 Forbidden because it is not public")
    void testRootReturnsForbiddenWhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value(containsString("full authentication is required")));
    }

    @Test
    @DisplayName("POST /api/health should be rejected with 403 Forbidden because only GET is public")
    void testPostApiHealthForbiddenWhenUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/health")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("Protected endpoint GET /api/users/me should be rejected with 403 when unauthenticated")
    void testProtectedUserEndpointForbiddenWhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value(containsString("full authentication is required")));
    }

    @Test
    @DisplayName("Protected endpoint GET /api/groups should be rejected with 403 when unauthenticated")
    void testProtectedGroupEndpointForbiddenWhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/groups"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("Admin endpoint GET /api/admin/overview should be rejected with 403 when unauthenticated")
    void testAdminEndpointForbiddenWhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/admin/overview"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }
}
