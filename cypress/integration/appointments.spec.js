const { CYCLIC_KEY } = require("@storybook/addon-actions/dist/constants");

describe("Appointments", () => {
  // First Steps: 
  // Resets the database for us everytime we run through test 
  // Visits the root of our web server 
  // confirm that DOM contains text "Monday"
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset")

    cy.visit("/")

    cy.contains("Monday");
  })

  xit("should book an interview", () => {
    // cy.visit("/")
    // cy.contains("[data-testid=day]", "Monday");

    // 2) Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add]")
      .first()
      .click();

    // 3) Enters their name
    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones");

    // 4) Chooses an interviewer
    cy.get("[alt='Sylvia Palmer']")
      .click();

    // 5) Clicks the save button
    cy.contains("Save")
      .click();

    // 6) Sees the booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  xit("should edit an interview", () => {
    cy.get("[alt=Add]")
    .first()
    .click();    
    
    cy.get("[data-testid=student-name-input]")
    .type("Lydia Miller-Jones");
    
    cy.get("[alt='Sylvia Palmer']")
    .click();
    
    cy.contains("Save")
    .click();
    
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
    

    // Clicks the edit button for the existing appointment
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });
    
    // Changes the name and interviewer
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();

    // Clicks the save button
    cy.contains("Save").click();

    // Sees the edit to the appointment    
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");    
  });

  it("should cancel an interview", () => {
    // Clicks the delete button for the existing appointment
    cy.get("[alt=Delete]") 
    .first()
    .click({ force: true });

    // Clicks the confirm button
    cy.contains("Confirm")
    .click();

    // Sees that the appointment slot is empty    
    cy.contains("DELETING").should("exist");
    cy.contains("DELETING").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });

});