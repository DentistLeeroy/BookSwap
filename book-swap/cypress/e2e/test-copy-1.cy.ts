describe('Profile Page', () => {
  beforeEach(() => {
    // Simulate the login process before visiting the profile page
    cy.visit('http://localhost:3000');
    cy.get('input[name="email"]').type('zeynos@gmail.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.wait(1000); // Wait for the login process to complete
  });

  it('should display the user profile', () => {

    // Add assertions to verify that the profile page is displayed correctly
    cy.contains('Your Profile');
    cy.contains('Name');
    cy.contains('About me');
    cy.contains('Interests');
    cy.contains('Books on the shelf');  
    cy.contains('Upload Book');
    
    cy.get('input').should('have.value', 'Zeynos');
    cy.get('textarea').should('have.value', 'Give me Zeynos kebabs and burgers and kebabs!');
  });
});
