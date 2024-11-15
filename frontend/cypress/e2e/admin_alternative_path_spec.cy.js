// cypress/e2e/admin_alternative_path_spec.js

describe('Admin Alternative Paths', () => {
  const existingAdminEmail = `existing_admin_${Date.now()}@example.com`; // Pre-existing email
  const adminPassword = 'SecurePass123!';
  const presentationName = `Presentation_${Date.now()}`;
  const invalidEmail = `invalid_email`; // Not a valid email format
  const mismatchedPassword = 'SecurePass456!';
  const shortPassword = '123'; // Password too short
  const invalidImagePath = 'invalid_file.txt'; // Unsupported file type

  before(() => {
    // Pre-register an admin to test duplicate registration
    cy.visit('http://localhost:3000/');
    cy.get('[aria-label="Register"]').click();

    // Fill out the registration form with existingAdminEmail
    cy.get('input[name="name"]').type('Existing Admin');
    cy.get('input[name="email"]').type(existingAdminEmail);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('input[name="confirmPassword"]').type(adminPassword);

    // Submit the registration form
    cy.get('button[aria-label="Register"]').click();

    // Verify successful registration
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    // Logout to allow duplicate registration attempt
    cy.get('button').contains('Logout').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Welcome to Presto').should('be.visible');
  });

  it('Prevents registration with an existing email', () => {
    cy.get('[aria-label="Register"]').click();

    // Attempt to register with an existing email
    cy.get('input[name="name"]').type('Admin User');
    cy.get('input[name="email"]').type(existingAdminEmail); // Existing email
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('input[name="confirmPassword"]').type(adminPassword);

    // Submit the registration form
    cy.get('button[aria-label="Register"]').click();

    // Verify error message is displayed
    cy.contains('Email address already registered').should('be.visible');
    
    // Ensure user remains on the registration page
    cy.url().should('include', '/register');
  });

  it('Prevents registration with invalid email format', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[aria-label="Register"]').click();

    // Attempt to register with an invalid email
    cy.get('input[name="name"]').type('Admin User');
    cy.get('input[name="email"]').type(invalidEmail); // Invalid email
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('input[name="confirmPassword"]').type(adminPassword);

    // Submit the registration form
    cy.get('button[aria-label="Register"]').click();

    // Ensure user remains on the registration page
    cy.url().should('include', '/register');
  });

  it('Prevents registration with mismatched passwords', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[aria-label="Register"]').click();

    // Attempt to register with mismatched passwords
    cy.get('input[name="name"]').type('Admin User');
    cy.get('input[name="email"]').type(`admin_mismatch_${Date.now()}@example.com`);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('input[name="confirmPassword"]').type(mismatchedPassword); // Mismatched password

    // Submit the registration form
    cy.get('button[aria-label="Register"]').click();

    // Verify error message is displayed
    cy.contains('Passwords do not match').should('be.visible');
    
    // Ensure user remains on the registration page
    cy.url().should('include', '/register');
  });

  it('Prevents creating a presentation without a name, add element to presentation, delete slide, and has correct URL', () => {
    // Login with existing admin credentials
    cy.visit('http://localhost:3000/');
    cy.get('[aria-label="Login"]').click();
    cy.get('input[name="email"]').type(existingAdminEmail);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('button[aria-label="Login"]').click();

    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    // Click on "Create New Presentation" button
    cy.get('button[aria-label="Create New Presentation"]').click();

    // Attempt to submit the creation form without a name
    cy.get('[aria-label="Presentation Name"]').clear(); // Ensure the input is empty
    cy.get('button[aria-label="Create Presentation"]').click();

    // Verify error message is displayed
    cy.contains('Presentation name cannot be empty').should('be.visible');
    
    // Ensure the presentation creation dialog remains open
    cy.get('[aria-label="Presentation Name"]').should('be.visible');

    // Fill out the presentation creation dialog with a name
    cy.get('[aria-label="Presentation Name"]').type(`Presentation_Invalid_File_${Date.now()}`);

    // Submit the creation form
    cy.get('button[aria-label="Create Presentation"]').click();

    // Navigate to the presentation page by clicking on the presentation name
    cy.get('[label="openButton"]').click();
    
    //Add text to presentation
    cy.get('button[aria-label="Add Text"]').click();

    cy.get('[aria-label="Text Content"]').type(existingAdminEmail);

    cy.get('button').contains('Add').click()

    // Check text is on the slide
    cy.contains(existingAdminEmail).should('be.visible');

    // Click on "Add New Slide"
    cy.get('button').contains('+ New Slide').click();

    // Verify that slides are added (assuming slides are listed or have indicators)
    cy.get('[aria-label="Slide Number"]').should('have.text', "2/2");
    
    // Check text is not on the slide
    cy.contains(existingAdminEmail).should('not.exist');

    // Check url is correct
    cy.url().should('include', 'slide=2');

    // Delete Slide
    cy.get('button').contains('Delete Slide').click()

    // Check Slide has been deleted and returned to first slide
    cy.get('[aria-label="Slide Number"]').should('have.text', "1/1");
    cy.contains(existingAdminEmail).should('be.visible');
    cy.url().should('include', 'slide=1');


  });

  it('Handles login with incorrect credentials', () => {
    cy.visit('http://localhost:3000/');

    // Click on the "Login" button
    cy.get('[aria-label="Login"]').click();

    // Attempt to login with incorrect password
    cy.get('input[name="email"]').type(existingAdminEmail);
    cy.get('input[name="password"]').type('WrongPassword!');
    cy.get('button[aria-label="Login"]').click();

    // Verify error message is displayed
    cy.contains('Invalid username or password').should('be.visible');

    // Ensure user remains on the login page
    cy.url().should('include', '/login');
  });

  it('Prevents accessing dashboard without authentication', () => {
    // Attempt to visit the dashboard directly without logging in
    cy.visit('http://localhost:3000/dashboard');

    // Verify redirection to the login page
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });
});
