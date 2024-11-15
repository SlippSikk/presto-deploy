# Testing.md

## Alternative Path

### Description

The Alternative Path focuses on validating the application's resilience against invalid inputs, duplicate actions, and unauthorized access. This path ensures that the application handles errors gracefully and maintains data integrity.

### Test Cases

1. **Prevent Duplicate Registration**
   - **Objective:** Ensure that the system does not allow multiple registrations with the same email.
   - **Steps:**
     1. Register an admin with a unique email.
     2. Log out.
     3. Attempt to register another admin using the same email.
   - **Expected Outcome:** The system should display an error message indicating that the email is already registered and prevent the second registration.

2. **Registration with Invalid Email Format**
   - **Objective:** Validate that the registration form enforces proper email formatting.
   - **Steps:**
     1. Navigate to the registration page.
     2. Enter an invalid email format (e.g., `invalid_email`).
     3. Fill in the other required fields correctly.
     4. Submit the registration form.
   - **Expected Outcome:** The system should display an error message about the invalid email format and prevent the registration.

3. **Registration with Mismatched Passwords**
   - **Objective:** Ensure that the system enforces password confirmation matching.
   - **Steps:**
     1. Navigate to the registration page.
     2. Enter a valid email and password.
     3. Enter a different password in the confirm password field.
     4. Submit the registration form.
   - **Expected Outcome:** The system should display an error message indicating that the passwords do not match and prevent the registration.

4. **Creating a Presentation Without a Name**
   - **Objective:** Verify that a presentation cannot be created without providing a name.
   - **Steps:**
     1. Log in as an existing admin.
     2. Attempt to create a new presentation without entering a name.
     3. Submit the creation form.
   - **Expected Outcome:** The system should display an error message stating that the presentation name cannot be empty and keep the creation dialog open.

5. **Adding Elements and Deleting Slides**
   - **Objective:** Test the functionality of adding elements to a slide, navigating between slides, and deleting slides.
   - **Steps:**
     1. Create a new presentation with a valid name.
     2. Add text to the first slide.
     3. Add a new slide to the presentation.
     4. Verify that the new slide is added and that the text from the first slide is not present.
     5. Delete the second slide.
   - **Expected Outcome:** 
     - The new slide should be successfully added and navigable.
     - The text should only appear on the first slide.
     - Deleting the second slide should revert to the first slide, maintaining the existing content.

6. **Login with Incorrect Credentials**
   - **Objective:** Ensure that the system prevents login attempts with incorrect passwords.
   - **Steps:**
     1. Navigate to the login page.
     2. Enter a valid email but an incorrect password.
     3. Attempt to log in.
   - **Expected Outcome:** The system should display an error message indicating invalid credentials and remain on the login page.

7. **Accessing Dashboard Without Authentication**
   - **Objective:** Confirm that unauthorized users cannot access protected routes.
   - **Steps:**
     1. Attempt to navigate directly to the dashboard URL without logging in.
   - **Expected Outcome:** The system should redirect the user to the login page and prevent access to the dashboard.

### Rationale

Testing the Alternative Path is crucial for several reasons:

1. **Prevent Duplicate Registration**
   - **Why:** Duplicate registrations can lead to data inconsistencies and potential security vulnerabilities. Ensuring that each email is unique maintains the integrity of user data and prevents unauthorized access through shared credentials.

2. **Registration with Invalid Email Format**
   - **Why:** Validating email formats ensures that users provide correct contact information, which is essential for communication and account recovery. It also prevents potential injection attacks through improperly formatted inputs.

3. **Registration with Mismatched Passwords**
   - **Why:** Enforcing password confirmation matching prevents user frustration caused by typographical errors and enhances account security by ensuring that users set their intended passwords correctly.

4. **Creating a Presentation Without a Name**
   - **Why:** A presentation without a name can lead to confusion and difficulties in managing and locating presentations. Enforcing a name requirement ensures better organization and user experience.

5. **Adding Elements and Deleting Slides**
   - **Why:** Testing the ability to add elements, navigate between slides, and delete slides ensures that the slideshow functionality is robust. It verifies that the application correctly manages the slide hierarchy and maintains content integrity when modifications occur.

6. **Login with Incorrect Credentials**
   - **Why:** Preventing login with incorrect credentials is fundamental for security. It protects user accounts from unauthorized access attempts and ensures that only legitimate users can access the system.

7. **Accessing Dashboard Without Authentication**
   - **Why:** Protecting sensitive routes like the dashboard is essential to maintain the application's security posture. Ensuring that unauthenticated users cannot access these areas prevents potential data breaches and unauthorized actions within the application.

### Comprehensive Benefits

- **Data Integrity:** By preventing duplicate registrations and ensuring mandatory fields are filled correctly, we maintain the consistency and reliability of the data within the application.
  
- **User Experience:** Providing clear error messages and preventing invalid actions helps users understand and correct their mistakes, leading to a smoother and more intuitive experience.
  
- **Security:** Enforcing strict authentication measures and protecting sensitive routes safeguard the application against unauthorized access and potential security threats.
  
- **Robustness:** Handling edge cases and unexpected inputs gracefully ensures that the application remains stable and performs reliably under various conditions, reducing the likelihood of crashes or unintended behavior.

By meticulously testing these alternative scenarios, we ensure that the application not only performs well under ideal conditions but also remains secure, reliable, and user-friendly when faced with invalid inputs or malicious attempts.

---

