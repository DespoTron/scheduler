import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

// using promise chain:
// it("defaults to Monday and changes the schedule when a new day is selected", () => {
//   const { getByText } = render(<Application />);

//   return waitForElement(() => getByText("Monday"))
//     .then(() => {
//       fireEvent.click(getByText("Tuesday"));
//       expect(getByText("Leopold Silvers")).toBeInTheDocument();
//    });
// });

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"))
    
    fireEvent.click(getByText("Tuesday"));
    
    expect(getByText("Leopold Silvers")).toBeInTheDocument();  
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />)
    
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
``
    // console.log(prettyDOM(container));
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));    

    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // expect(getByText(appointment, "SAVING")).not.toBeInTheDocument(); // fails test because SAVING is in document

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones")); //can provide a helpful message if we use Jest timeout
    // await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones")); // Using query will return a null value when we dont find matching element

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
      
    // console.log(prettyDOM(day));
    // console.log(prettyDOM(appointments));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();      
    // debug()
  })

});

