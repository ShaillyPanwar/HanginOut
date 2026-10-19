package com.hanginout.auth.service;

import com.hanginout.auth.dto.AuthResponse;
import com.hanginout.auth.dto.LoginRequest;
import com.hanginout.auth.dto.RegisterRequest;
import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.DuplicateResourceException;
import com.hanginout.common.security.JwtTokenProvider;
import com.hanginout.user.dto.UserDTO;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An account with email " + normalizedEmail + " already exists");
        }

        User user = new User(
                normalizedEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getName().trim(),
                request.getAge(),
                request.getCity() != null ? request.getCity().trim() : null,
                "ROLE_USER"
        );

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getName());

        return new AuthResponse(token, UserDTO.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadRequestException("Your account has been deactivated. Please contact support.");
        }

        String token = jwtTokenProvider.generateToken(authentication);
        return new AuthResponse(token, UserDTO.fromEntity(user));
    }
}
