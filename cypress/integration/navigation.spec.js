describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it('should navigate to Tuesday', () => {
    // First step visit root server
    cy.visit('/');

    // 2nd step get the li item
    // that contains the text "Tuesday"
    // and then click on it
    // cy.get("li")
    // .contains("Tuesday")
    // .click()

    // // 3rd step checks that "Tuesday" list item has a particular off white background color
    // cy.get("li")
    //   .contains("li", "Tuesday")
    //   .should("have.css", "background-color", "rgb(242, 242, 242)");

    // Refactored last two steps into one
    // cy.contains("li", "Tuesday")
    //   .click()
    //   .should("have.css", "background-color", "rgb(242, 242, 242)")

    // Refactored test to use the data-testid attribute that already exists
    // cy.contains("[data-testid=day]", "Tuesday")
    //   .click()
    //   .should("have.css", "background-color", "rgb(242, 242, 242)")

    // Refactored test again to remove targeted css 
    // Instead target class 
    cy.contains("[data-testid=day]", "Tuesday")
    .click()
    .should("have.class", "day-list__item--selected")
  });

});