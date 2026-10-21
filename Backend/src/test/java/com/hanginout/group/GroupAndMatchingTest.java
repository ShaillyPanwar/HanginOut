package com.hanginout.group;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanginout.group.dto.CreateGroupRequest;
import com.hanginout.group.dto.GroupSwipeRequest;
import com.hanginout.group.dto.JoinGroupRequest;
import com.hanginout.plan.dto.CreatePlanRequest;
import org.junit.jupiter.api.BeforeEach;
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

import java.time.LocalDate;
import java.time.LocalTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class GroupAndMatchingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String tokenUserA;
    private static String tokenUserB;
    private static String tokenUserC;
    private static Long createdGroupId;
    private static String groupInviteCode;
    private static Long createdPlanId;

    @BeforeEach
    void setupTokens() throws Exception {
        if (tokenUserA == null) {
            tokenUserA = getOrCreateUser("User Alpha", "alpha@group.test", "alpha123");
            tokenUserB = getOrCreateUser("User Beta", "beta@group.test", "beta1234");
            tokenUserC = getOrCreateUser("User Charlie", "charlie@group.test", "charlie123");
        }
    }

    private String getOrCreateUser(String name, String email, String password) throws Exception {
        String loginPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
        MvcResult loginRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andReturn();

        if (loginRes.getResponse().getStatus() == 200) {
            return objectMapper.readTree(loginRes.getResponse().getContentAsString()).path("data").path("token").asText();
        }

        String regPayload = String.format("{\"name\":\"%s\",\"email\":\"%s\",\"password\":\"%s\",\"age\":21,\"city\":\"Delhi\"}", name, email, password);
        MvcResult regRes = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(regPayload))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(regRes.getResponse().getContentAsString()).path("data").path("token").asText();
    }

    @Test
    @Order(1)
    void shouldCreateGroupWithUniqueInviteCode() throws Exception {
        CreateGroupRequest req = new CreateGroupRequest("Weekend Squad");

        MvcResult result = mockMvc.perform(post("/api/groups")
                        .header("Authorization", "Bearer " + tokenUserA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.name").value("Weekend Squad"))
                .andExpect(jsonPath("$.data.inviteCode", startsWith("HNG")))
                .andExpect(jsonPath("$.data.membersCount").value(1))
                .andReturn();

        String body = result.getResponse().getContentAsString();
        createdGroupId = objectMapper.readTree(body).path("data").path("id").asLong();
        groupInviteCode = objectMapper.readTree(body).path("data").path("inviteCode").asText();
    }

    @Test
    @Order(2)
    void shouldAllowUserBToJoinGroupByInviteCode() throws Exception {
        JoinGroupRequest req = new JoinGroupRequest(groupInviteCode);

        mockMvc.perform(post("/api/groups/join")
                        .header("Authorization", "Bearer " + tokenUserB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.id").value(createdGroupId))
                .andExpect(jsonPath("$.data.membersCount").value(2));
    }

    @Test
    @Order(3)
    void shouldPreventNonMemberFromViewingPrivateGroup() throws Exception {
        mockMvc.perform(get("/api/groups/" + createdGroupId)
                        .header("Authorization", "Bearer " + tokenUserC))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @Order(4)
    void shouldCalculateUnanimousMatchWhenBothMembersLikeActivity() throws Exception {
        // Both A and B like Activity #1
        GroupSwipeRequest swipe = new GroupSwipeRequest(1L, "LIKE");

        mockMvc.perform(post("/api/groups/" + createdGroupId + "/swipes")
                        .header("Authorization", "Bearer " + tokenUserA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(swipe)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/groups/" + createdGroupId + "/swipes")
                        .header("Authorization", "Bearer " + tokenUserB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(swipe)))
                .andExpect(status().isOk());

        // Check matches: Activity 1 should be a 100% UNANIMOUS match!
        mockMvc.perform(get("/api/groups/" + createdGroupId + "/matches")
                        .header("Authorization", "Bearer " + tokenUserA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.totalMembers").value(2))
                .andExpect(jsonPath("$.data.unanimousMatches", hasSize(1)))
                .andExpect(jsonPath("$.data.unanimousMatches[0].activity.id").value(1))
                .andExpect(jsonPath("$.data.unanimousMatches[0].matchPercentage").value(100.0))
                .andExpect(jsonPath("$.data.unanimousMatches[0].unanimous").value(true))
                .andExpect(jsonPath("$.data.unanimousMatches[0].likesCount").value(2));
    }

    @Test
    @Order(5)
    void shouldCalculateConsensusRankingWhenOnlyOneMemberLikesActivity() throws Exception {
        // A likes Activity #2, B rejects Activity #2
        GroupSwipeRequest like = new GroupSwipeRequest(2L, "LIKE");
        GroupSwipeRequest reject = new GroupSwipeRequest(2L, "REJECT");

        mockMvc.perform(post("/api/groups/" + createdGroupId + "/swipes")
                        .header("Authorization", "Bearer " + tokenUserA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(like)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/groups/" + createdGroupId + "/swipes")
                        .header("Authorization", "Bearer " + tokenUserB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reject)))
                .andExpect(status().isOk());

        // Check matches: Activity 2 should be in consensusMatches with 50%
        mockMvc.perform(get("/api/groups/" + createdGroupId + "/matches")
                        .header("Authorization", "Bearer " + tokenUserB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.consensusMatches", hasSize(1)))
                .andExpect(jsonPath("$.data.consensusMatches[0].activity.id").value(2))
                .andExpect(jsonPath("$.data.consensusMatches[0].matchPercentage").value(50.0))
                .andExpect(jsonPath("$.data.consensusMatches[0].unanimous").value(false))
                .andExpect(jsonPath("$.data.consensusMatches[0].likesCount").value(1))
                .andExpect(jsonPath("$.data.consensusMatches[0].rejectsCount").value(1));
    }

    @Test
    @Order(6)
    void shouldCreateHangoutPlanFromMatchedActivity() throws Exception {
        CreatePlanRequest planReq = new CreatePlanRequest(
                1L,
                3L, // Spot #3 (Sunder Nursery)
                LocalDate.now().plusDays(2),
                LocalTime.of(17, 30)
        );

        MvcResult result = mockMvc.perform(post("/api/groups/" + createdGroupId + "/plans")
                        .header("Authorization", "Bearer " + tokenUserA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(planReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.data.activity.id").value(1))
                .andExpect(jsonPath("$.data.spot.id").value(3))
                .andExpect(jsonPath("$.data.status").value("PLANNED"))
                .andReturn();

        createdPlanId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();
    }

    @Test
    @Order(7)
    void shouldRetrieveAndModifyHangoutPlan() throws Exception {
        // Retrieve plans for group
        mockMvc.perform(get("/api/groups/" + createdGroupId + "/plans")
                        .header("Authorization", "Bearer " + tokenUserB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id").value(createdPlanId));

        // Update plan status to COMPLETED
        String updatePayload = "{\"status\":\"COMPLETED\"}";
        mockMvc.perform(put("/api/plans/" + createdPlanId)
                        .header("Authorization", "Bearer " + tokenUserA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }
}
