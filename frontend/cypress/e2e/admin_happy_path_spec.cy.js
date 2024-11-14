// cypress/e2e/admin_happy_path_spec.js

describe('Admin Happy Path', () => {
  const adminEmail = `admin_${Date.now()}@example.com`; // Unique email to prevent conflicts
  const adminPassword = 'SecurePass123!';
  const presentationName = `Presentation_${Date.now()}`;
  const updatedPresentationName = `Updated_${presentationName}`;

  before(() => {
    // Runs once before all tests in the block
    cy.visit('/'); // Visit the landing page
  });

  it('Registers successfully', () => {
    cy.get('[aria-label="Register"]').click();

    // Fill out the registration form
    cy.get('input[aria-label="Name"]').type('Admin User');
    cy.get('input[aria-label="Email"]').type(adminEmail);
    cy.get('input[aria-label="Password"]').type(adminPassword);
    cy.get('input[aria-label="Confirm Password"]').type(adminPassword);

    // Submit the registration form
    cy.get('button[aria-label="Register"]').click();

    // Verify successful registration by checking redirection to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('Creates a new presentation successfully', () => {
    // Click on "New Presentation" button
    cy.get('button[aria-label="Create New Presentation"]').click();

    // Fill out the presentation creation dialog
    cy.get('input[aria-label="Presentation Name"]').type(presentationName);

    // Submit the creation form
    cy.get('button[aria-label="Create Presentation"]').click();

    // Verify the presentation appears in the dashboard
    cy.contains(presentationName).should('be.visible');
  });

  it('Updates the thumbnail and name of the presentation successfully', () => {
    // Locate the presentation card and click on it to navigate to the presentation page
    cy.contains(presentationName)
      .parent()
      .within(() => {
        cy.get('a').click(); // Assuming the presentation name is wrapped in a link
      });

    // Update the presentation name
    cy.get('button[aria-label="Edit Title"]').click();
    cy.get('input[aria-label="New Title"]').clear().type(updatedPresentationName);
    cy.get('button').contains('Update').click();

    // Verify the updated name is displayed
    cy.contains(updatedPresentationName).should('be.visible');

    // Update the thumbnail
    cy.get('button[aria-label="Edit Thumbnail"]').click();
    const imagePath = 'cypress/fixtures/thumbnail.jpg'; // Ensure this image exists
    cy.get('input[aria-label="Upload Thumbnail"]').attachFile(imagePath);
    cy.get('button').contains('Update').click();

    // Verify the thumbnail is updated (assuming the img has alt text)
    cy.get('img[alt="Thumbnail Preview"]').should('have.attr', 'src').and('include', 'data:image');
  });

  it('Adds some slides in a slideshow deck successfully', () => {
    // Click on "Add New Slide" button multiple times
    cy.get('button').contains('+ New Slide').click();
    cy.wait(500); // Optional: Wait for slide to be added
    cy.get('button').contains('+ New Slide').click();

    // Verify that slides are added (assuming slides are listed or have indicators)
    cy.get('.slide-thumbnail').should('have.length.at.least', 2);
  });

  it('Switches between slides successfully', () => {
    // Navigate to the first slide
    cy.get('button').contains('Previous').should('be.disabled'); // First slide, Previous should be disabled
    cy.get('button').contains('Next').click();

    // Verify we're on the second slide
    cy.get('.slide-number').should('contain', '2');

    // Navigate back to the first slide
    cy.get('button').contains('Previous').click();
    cy.get('.slide-number').should('contain', '1');
  });

  it('Deletes a presentation successfully', () => {
    // Navigate back to dashboard
    cy.get('button').contains('Back').click();
    cy.url().should('include', '/dashboard');

    // Locate the presentation and delete it
    cy.contains(updatedPresentationName)
      .parent()
      .within(() => {
        cy.get('button').contains('Delete Presentation').click();
      });

    // Confirm deletion in the dialog
    cy.get('button').contains('Yes').click();

    // Verify the presentation is no longer in the dashboard
    cy.contains(updatedPresentationName).should('not.exist');
  });

  it('Logs out of the application successfully', () => {
    // Click on the logout button in the Navbar
    cy.get('button').contains('Logout').click();

    // Verify redirection to the landing page
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Welcome to Presto').should('be.visible');
  });

  it('Logs back into the application successfully', () => {
    // Click on the "Login" button
    cy.get('button[aria-label="Login"]').click();

    // Fill out the login form
    cy.get('input[aria-label="Email"]').type(adminEmail);
    cy.get('input[aria-label="Password"]').type(adminPassword);

    // Submit the login form
    cy.get('button[aria-label="Login"]').click();

    // Verify successful login by checking redirection to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
});
