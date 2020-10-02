import Appointment from "components/Appointment";

export function getAppointmentsForDay(state, day) {
  let appointments = [];

  for (const days of state.days) {
    if (days.name === day) {
      appointments = [...days.appointments];
      //console.log(appointments)
    }
  }
  // console.log("Appointemnts TOP", appointments)

  let matchingAppointments = [];

  for (const appoint in state.appointments) {
    // console.log("STATE appointments", appoint)
    // console.log("WHAT YOU GIVE ME", state.appointments[appoint])
    for (const appointment of appointments) {
      // console.log("TOP APPOINTMENTS LOOP", appointment)
      if(state.appointments[appoint].id === appointment) {
        matchingAppointments.push(state.appointments[appoint])
        //console.log("MATCHING", matchingAppointments)
      }
    }
  }
  return matchingAppointments;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  };

  const interviewObj = {};
  // console.log("Interview.student", interview.student)
  interviewObj.student = interview.student;
  interviewObj.interviewer = state.interviewers[interview.interviewer];
  // console.log("STATE.interviewers", state.interviewers)
  // console.log("INTERVIEW.interviewes", interview.interviewer)
  // console.log("STATE", state.interviewers[interview.interviewer])

  return interviewObj;
}

export function getInterviewersForDay(state, day) {
  let interviewDays = [];

  for (const days of state.days) {
    if (days.name === day) {
      interviewDays = [...days.interviewers];
      // console.log(interviewDays)
    }
  }
  

  if (state.days.length === 0 || interviewDays === undefined) {
    return [];
  }

  let matchingInterviewersDay = [];

  for (const appoint in state.interviewers) {

    for (const appointment of interviewDays) {
      // console.log("APPONMENT", appointment)
      // console.log("STATE INTERVIEWERS", state.interviewers[appoint].id)
      if(state.interviewers[appoint].id === appointment) {
        // console.log("STATE APPOINT", state.interviewers[appoint])
        matchingInterviewersDay.push(state.interviewers[appoint])
        // console.log(matchingInterviewersDay)
      }
    }
  }
  return matchingInterviewersDay;
};
