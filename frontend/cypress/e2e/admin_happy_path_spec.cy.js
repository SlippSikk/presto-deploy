// cypress/e2e/admin_happy_path_spec.js

describe('Admin Happy Path', () => {
  const adminEmail = `admin_${Date.now()}@example.com`; // Unique email to prevent conflicts
  const adminPassword = 'SecurePass123!';
  const presentationName = `Presentation_${Date.now()}`;
  const updatedPresentationName = `Updated_${presentationName}`;

  it('Completes the admin happy path successfully', () => {
    // Visit the landing page
    cy.visit('http://localhost:3000/');

    // Register
    cy.get('[data-cy=register-button]').click();
    cy.get('[data-cy=register-name-input]').type('Admin User');
    cy.get('[data-cy=register-email-input]').type(adminEmail);
    cy.get('[data-cy=register-password-input]').type(adminPassword);
    cy.get('[data-cy=register-confirm-password-input]').type(adminPassword);
    cy.get('[data-cy=register-submit-button]').click();

    // Verify successful registration by checking redirection to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    // Create a new presentation
    cy.get('[data-cy=create-presentation-button]').click();
    cy.get('[data-cy=presentation-name-input]').type(presentationName);
    cy.get('[data-cy=confirm-create-presentation-button]').click();
    cy.contains(presentationName).should('be.visible');

    // Navigate to the presentation page
    cy.contains(presentationName).click();

    // Update the presentation name
    cy.get('[data-cy=edit-title-button]').click();
    cy.get('[data-cy=new-title-input]').clear().type(updatedPresentationName);
    cy.get('[data-cy=update-title-button]').click();
    cy.contains(updatedPresentationName).should('be.visible');

    // Update the thumbnail
    cy.get('[data-cy=edit-thumbnail-button]').click();
    const imagePath = 'thumbnail.jpg'; // Ensure this file exists in cypress/fixtures/
    cy.get('[data-cy=upload-thumbnail-input]').attachFile(imagePath);
    cy.get('[data-cy=update-thumbnail-button]').click();
    cy.get('img[alt="Thumbnail Preview"]').should('have.attr', 'src').and('include', 'data:image');

    // Add a new slide
    cy.get('[data-cy=add-slide-button]').click();
    cy.get('[data-cy=slide-thumbnail]').should('have.length.at.least', 1);

    // Navigate to the next slide
    cy.get('[data-cy=next-slide-button]').click();
    cy.get('[data-cy=slide-number]').should('contain', '2');

    // Navigate back to the first slide
    cy.get('[data-cy=previous-slide-button]').click();
    cy.get('[data-cy=slide-number]').should('contain', '1');

    // Delete the presentation
    cy.get('[data-cy=delete-presentation-button]').click();
    cy.get('[data-cy=confirm-delete-presentation-button]').click();
    cy.contains(updatedPresentationName).should('not.exist');

    // Logout of the application
    cy.get('[data-cy=logout-button]').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Welcome to Presto').should('be.visible');

    // Log back into the application
    cy.get('[data-cy=login-button]').click();
    cy.get('[data-cy=login-email-input]').type(adminEmail);
    cy.get('[data-cy=login-password-input]').type(adminPassword);
    cy.get('[data-cy=login-submit-button]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
});
