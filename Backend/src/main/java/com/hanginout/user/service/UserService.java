package com.hanginout.user.service;

import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.user.dto.UpdateProfileRequest;
import com.hanginout.user.dto.UserDTO;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDTO.fromEntity(user);
    }

    @Transactional
    public UserDTO updateCurrentUserProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setName(request.getName().trim());
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        } else if (request.getAge() != null) {
            user.setDateOfBirth(LocalDate.now().minusYears(request.getAge()));
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity().trim());
        }

        User updated = userRepository.save(user);
        return UserDTO.fromEntity(updated);
    }
}
