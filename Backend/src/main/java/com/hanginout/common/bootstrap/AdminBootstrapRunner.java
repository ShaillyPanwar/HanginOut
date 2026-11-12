package com.hanginout.common.bootstrap;

import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
public class AdminBootstrapRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public AdminBootstrapRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.bootstrap.email:}") String adminEmail,
            @Value("${app.admin.bootstrap.password:}") String adminPassword,
            @Value("${app.admin.bootstrap.name:System Administrator}") String adminName) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!StringUtils.hasText(adminEmail) || !StringUtils.hasText(adminPassword)) {
            logger.info("Admin bootstrap: APP_ADMIN_EMAIL or APP_ADMIN_PASSWORD not set. Automatic bootstrap skipped.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase();

        userRepository.findByEmail(normalizedEmail).ifPresentOrElse(
                existingUser -> {
                    if (!"ROLE_ADMIN".equals(existingUser.getRole())) {
                        existingUser.setRole("ROLE_ADMIN");
                        existingUser.setActive(true);
                        userRepository.save(existingUser);
                        logger.info("Admin bootstrap: Successfully updated existing user {} to ROLE_ADMIN.", normalizedEmail);
                    } else {
                        logger.info("Admin bootstrap: Administrator account {} already exists with ROLE_ADMIN.", normalizedEmail);
                    }
                },
                () -> {
                    User admin = new User(
                            normalizedEmail,
                            passwordEncoder.encode(adminPassword),
                            StringUtils.hasText(adminName) ? adminName.trim() : "System Administrator",
                            25,
                            "Delhi",
                            "ROLE_ADMIN"
                    );
                    userRepository.save(admin);
                    logger.info("Admin bootstrap: Successfully created new administrator account for {}.", normalizedEmail);
                }
        );
    }
}
