package com.hanginout.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanginout.activity.entity.Category;
import com.hanginout.activity.repository.CategoryRepository;
import com.hanginout.admin.dto.*;
import com.hanginout.auth.dto.LoginRequest;
import com.hanginout.auth.dto.RegisterRequest;
import com.hanginout.common.security.JwtTokenProvider;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AdminSecurityAndOperationsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static String regularUserToken;
    private static Long regularUserId;
    private static String adminToken;
    private static Long adminId;
    private static Long createdCategoryId;
    private static Long createdSpotId;
    private static Long createdActivityId;

    @BeforeEach
    void setUp() {
        if (adminToken == null) {
            // Provision test admin
            User admin = userRepository.findByEmail("superadmin@hanginout.test")
                    .orElseGet(() -> userRepository.save(new User(
                            "superadmin@hanginout.test",
                            passwordEncoder.encode("AdminPass123!"),
                            "Super Admin",
                            30,
                            "Delhi",
                            "ROLE_ADMIN"
                    )));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            adminId = admin.getId();
            adminToken = jwtTokenProvider.generateToken(admin.getEmail(), admin.getId(), admin.getName(), admin.getRole());
        }

        if (regularUserToken == null) {
            // Provision regular user
            User student = userRepository.findByEmail("student.sam@hanginout.test")
                    .orElseGet(() -> userRepository.save(new User(
                            "student.sam@hanginout.test",
                            passwordEncoder.encode("StudentPass123!"),
                            "Student Sam",
                            20,
                            "Delhi",
                            "ROLE_USER"
                    )));
            student.setRole("ROLE_USER");
            userRepository.save(student);
            regularUserId = student.getId();
            regularUserToken = jwtTokenProvider.generateToken(student.getEmail(), student.getId(), student.getName(), student.getRole());
        }
    }

    @Test
    @Order(1)
    void shouldDenyUnauthenticatedAccessToAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/analytics"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(2)
    void shouldDenyRegularUserFromAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + regularUserToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + regularUserToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/activities")
                        .header("Authorization", "Bearer " + regularUserToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(3)
    void shouldPreventRoleEscalationViaProfileUpdate() throws Exception {
        // Attempting to inject "role": "ROLE_ADMIN" into profile update payload
        String maliciousPayload = "{\"name\":\"Hacker Sam\",\"age\":22,\"city\":\"Mumbai\",\"role\":\"ROLE_ADMIN\"}";

        mockMvc.perform(put("/api/users/me")
                        .header("Authorization", "Bearer " + regularUserToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(maliciousPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Hacker Sam"));

        User persisted = userRepository.findById(regularUserId).orElseThrow();
        assertEquals("ROLE_USER", persisted.getRole());

        // Verify still forbidden from admin APIs
        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + regularUserToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    void shouldAllowAdminToAccessAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.totalUsers").isNumber())
                .andExpect(jsonPath("$.data.activeUsers").isNumber())
                .andExpect(jsonPath("$.data.totalActivities").isNumber());
    }

    @Test
    @Order(5)
    void shouldAllowAdminToManageCategories() throws Exception {
        AdminCategoryRequest categoryRequest = new AdminCategoryRequest(
                "Laser Tag Arena",
                "Indoor futuristic laser games",
                "crosshair"
        );

        MvcResult result = mockMvc.perform(post("/api/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Laser Tag Arena"))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        createdCategoryId = objectMapper.readTree(content).path("data").path("id").asLong();

        // Admin update category
        categoryRequest.setName("Laser Tag Battles");
        mockMvc.perform(put("/api/admin/categories/" + createdCategoryId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Laser Tag Battles"));
    }

    @Test
    @Order(6)
    void shouldAllowAdminToManageSpotsAndActivities() throws Exception {
        // Create Spot
        AdminSpotRequest spotRequest = new AdminSpotRequest();
        spotRequest.setName("Central Arcade Zone");
        spotRequest.setAddress("Connaught Place Block B");
        spotRequest.setCity("Delhi");
        spotRequest.setMinCost(BigDecimal.valueOf(100));
        spotRequest.setMaxCost(BigDecimal.valueOf(500));
        spotRequest.setActive(true);

        MvcResult spotResult = mockMvc.perform(post("/api/admin/spots")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(spotRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Central Arcade Zone"))
                .andReturn();

        createdSpotId = objectMapper.readTree(spotResult.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Create Activity
        AdminActivityCreateRequest actRequest = new AdminActivityCreateRequest();
        actRequest.setCategoryId(createdCategoryId);
        actRequest.setTitle("Championship Laser Battle");
        actRequest.setDescription("Team battle in neon maze");
        actRequest.setMinCost(BigDecimal.valueOf(250));
        actRequest.setMaxCost(BigDecimal.valueOf(400));
        actRequest.setDurationMinutes(60);
        actRequest.setCity("Delhi");
        actRequest.setLocationType("Indoor");
        actRequest.setGroupType("Friends");
        actRequest.setSpotIds(List.of(createdSpotId));

        MvcResult actResult = mockMvc.perform(post("/api/admin/activities")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Championship Laser Battle"))
                .andReturn();

        createdActivityId = objectMapper.readTree(actResult.getResponse().getContentAsString()).path("data").path("id").asLong();

        // Update Activity
        AdminActivityUpdateRequest updateRequest = new AdminActivityUpdateRequest();
        updateRequest.setCategoryId(createdCategoryId);
        updateRequest.setTitle("Ultimate Laser Showdown");
        updateRequest.setDescription("Updated neon maze action");
        updateRequest.setMinCost(BigDecimal.valueOf(300));
        updateRequest.setMaxCost(BigDecimal.valueOf(500));
        updateRequest.setDurationMinutes(90);
        updateRequest.setCity("Delhi");
        updateRequest.setActive(true);
        updateRequest.setSpotIds(List.of(createdSpotId));

        mockMvc.perform(put("/api/admin/activities/" + createdActivityId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Ultimate Laser Showdown"));
    }

    @Test
    @Order(7)
    void shouldAllowAdminToManageUsersAndPreventSelfHarm() throws Exception {
        // Toggle regular user status
        AdminUpdateUserStatusRequest statusRequest = new AdminUpdateUserStatusRequest();
        statusRequest.setActive(false);

        mockMvc.perform(patch("/api/admin/users/" + regularUserId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(false));

        // Re-activate regular user
        statusRequest.setActive(true);
        mockMvc.perform(patch("/api/admin/users/" + regularUserId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(true));

        // Self-deactivation prevention
        statusRequest.setActive(false);
        mockMvc.perform(patch("/api/admin/users/" + adminId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("cannot deactivate their own account")));

        // Self-demotion prevention
        AdminUpdateUserRoleRequest roleRequest = new AdminUpdateUserRoleRequest();
        roleRequest.setRole("ROLE_USER");

        mockMvc.perform(patch("/api/admin/users/" + adminId + "/role")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("cannot demote their own account")));
    }

    @Test
    @Order(8)
    void shouldAllowAdminToUploadSpotImageFromPc() throws Exception {
        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "test-spot.jpg",
                "image/jpeg",
                "fake image content".getBytes()
        );

        mockMvc.perform(multipart("/api/admin/spots/upload-image")
                        .file(imageFile)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.url", containsString("/uploads/spots/")));
    }

    @Test
    @Order(9)
    void shouldRejectSpotImageUploadFromRegularUser() throws Exception {
        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "hacker.jpg",
                "image/jpeg",
                "fake image content".getBytes()
        );

        mockMvc.perform(multipart("/api/admin/spots/upload-image")
                        .file(imageFile)
                        .header("Authorization", "Bearer " + regularUserToken))
                .andExpect(status().isForbidden());
    }
}
