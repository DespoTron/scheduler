import React from "react";

import { 
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  getByText, 
  prettyDOM, 
  getAllByTestId, 
  getByAltText, 
  getByPlaceholderText, 
  queryByText, 
  queryByAltText, wait } from "@testing-library/react";

import Application from "components/Application";
import axios from 'axios';

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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
  
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    // debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));
    
    // console.log(prettyDOM(container))

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    })

		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

		fireEvent.click(getByText(appointment, "Save"));

		expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    // debug();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

		await waitForElement(() =>
			queryByText(appointment, "Could not save appointment")
    );
    
    // debug();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug} = render(<Application />);
  });

});

