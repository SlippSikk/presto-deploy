// cypress/e2e/admin_happy_path_spec.js

describe('Admin Happy Path', () => {
  const adminEmail = `admin_${Date.now()}@example.com`; // Unique email to prevent conflicts
  const adminPassword = 'SecurePass123!';
  const presentationName = `Presentation_${Date.now()}`;
  const updatedPresentationName = `Updated_${presentationName}`;

  before(() => {
    // Runs once before all tests in the block
    cy.visit('http://localhost:3000/'); // Visit the landing page
  });

  it('Registers successfully', () => {
    cy.get('[aria-label="Register"]').click();

    // Fill out the registration form
    cy.get('input[name="name"]').type('Admin User');
    cy.get('input[name="email"]').type(adminEmail);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('input[name="confirmPassword"]').type(adminPassword);

    // Submit the registration form
    cy.get('button[aria-label="Register"]').click();

    // Verify successful registration by checking redirection to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    // Click on "New Presentation" button
    cy.get('button[aria-label="Create New Presentation"]').click();

    // Fill out the presentation creation dialog
    cy.get('[aria-label="Presentation Name"]').type(presentationName);

    // Submit the creation form
    cy.get('button[aria-label="Create Presentation"]').click();

    // Verify the presentation appears in the dashboard
    cy.contains(presentationName).should('be.visible');

    // Navigate to the presentation page by clicking on the presentation name
    cy.get('[label="openButton"]').click();

    // Update the presentation name
    cy.get('button[aria-label="Edit Title"]').click();
    cy.get('[aria-label="New Title"]').clear().type(updatedPresentationName);
    cy.get('button').contains('Update').click();

    // Verify the updated name is displayed
    cy.contains(updatedPresentationName).should('be.visible');

    // Update the thumbnail
    cy.get('button[aria-label="Edit Thumbnail"]').click();
    const imagePath = 'thumbnail.jpeg'; // Ensure this image exists
    cy.get('input[aria-label="Upload Thumbnail"]').attachFile(imagePath);
    cy.get('button').contains('Update').click();

    // Verify the thumbnail is updated (assuming the img has alt text)
    cy.get('img[alt="Thumbnail Preview"]').should('have.attr', 'src').and('include', 'data:image');

    // Click on "Add New Slide" button multiple times
    cy.get('button').contains('+ New Slide').click();
    cy.wait(500); // Optional: Wait for slide to be added
    cy.get('button').contains('+ New Slide').click();

    // Verify that slides are added (assuming slides are listed or have indicators)
    cy.get('[aria-label="Slide Number"]').should('have.text', "3/3");

    // Navigate to the first slide
    cy.get('[aria-label="Next Slide"]').should('be.disabled'); // First slide, Previous should be disabled
    cy.get('[aria-label="Previous Slide"]').click()

    // Verify we're on the second slide
    cy.get('[aria-label="Slide Number"]').should('have.text', "2/3");

    // Navigate back to the first slide
    cy.get('[aria-label="Previous Slide"]').click()
    cy.get('[aria-label="Slide Number"]').should('have.text', "1/3");

    //Delete Presentation
    cy.get('button').contains('Delete Presentation').click()
    cy.get('button').contains('Yes').click()

    // Navigate back to dashboard
    cy.url().should('include', '/dashboard');

    // Verify the presentation is no longer in the dashboard
    cy.contains(updatedPresentationName).should('not.exist');

    // Click on the logout button in the Navbar
    cy.get('button').contains('Logout').click();

    // Verify redirection to the landing page
    cy.url().should('eq', `http://localhost:3000/`);
    cy.contains('Welcome to Presto').should('be.visible');

    // Click on the "Login" button
    cy.get('[aria-label="Login"]').click();

    // Confirm on login page
    cy.url().should('include', '/login');

    // Fill out the login form
    cy.get('input[name="email"]').type(adminEmail);
    cy.get('input[name="password"]').type(adminPassword);

    // Submit the login form
    cy.get('button[aria-label="Login"]').click();

    // Verify successful login by checking redirection to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
});
