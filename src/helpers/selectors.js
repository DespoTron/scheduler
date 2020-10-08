import Appointment from "components/Appointment";

export function getAppointmentsForDay(state, day) {
  let appointments = [];

  for (const days of state.days) {
    if (days.name === day) {
      appointments = [...days.appointments];
    }
  }
  
  let matchingAppointments = [];

  for (const appoint in state.appointments) {
    for (const appointment of appointments) {
      if(state.appointments[appoint].id === appointment) {
        matchingAppointments.push(state.appointments[appoint])
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

  interviewObj.student = interview.student;
  interviewObj.interviewer = state.interviewers[interview.interviewer];

  return interviewObj;
}

export function getInterviewersForDay(state, day) {
  let interviewDays = [];

  for (const days of state.days) {
    if (days.name === day) {
      interviewDays = [...days.interviewers];
    }
  }
  

  if (state.days.length === 0 || interviewDays === undefined) {
    return [];
  }

  let matchingInterviewersDay = [];

  for (const appoint in state.interviewers) {

    for (const appointment of interviewDays) {
      if(state.interviewers[appoint].id === appointment) {
        matchingInterviewersDay.push(state.interviewers[appoint])
      }
    }
  }
  return matchingInterviewersDay;
};
