import Appointment from "components/Appointment";

export function getAppointmentsForDay(state, day) {
  let appointments = [];

  for (const days of state.days) {
    if (days.name === day) {
      appointments = [...days.appointments];
      console.log(appointments)
    }
  }
  console.log("Appointemnts TOP", appointments)

  let matchingAppointments = [];

  for (const appoint in state.appointments) {
    // console.log("STATE appointments", appoint)
    // console.log("WHAT YOU GIVE ME", state.appointments[appoint])
    for (const appointment of appointments) {
      // console.log("TOP APPOINTMENTS LOOP", appointment)
      if(state.appointments[appoint].id === appointment) {
        matchingAppointments.push(state.appointments[appoint])
        // console.log("MATCHING", matchingAppointments)
      }
    }
  }
  
  return matchingAppointments;
};