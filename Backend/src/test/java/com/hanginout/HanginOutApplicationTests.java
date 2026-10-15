package com.hanginout;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class HanginOutApplicationTests {

    @Test
    void contextLoads() {
        // Assert that the Spring application context loads without failure
    }
}
