import React from 'react';

import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from './Empty';
import useVisualMode from "hooks/useVisualMode";
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW)
      })
      .catch((error) => transition(ERROR_SAVE, true))
  }

  const deleteAppointment = (id) => {
    // transition(CONFIRM)
    transition(DELETE, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY)
      })
      .catch((error) => transition(ERROR_DELETE, true))
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={() => back()} 
          onSave={save} 
        />
      )}
      {mode === SAVING && (
        <Status 
          message={SAVING}
        />
      )}
      {mode === DELETE && (
        <Status 
          message={DELETE}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          onCancel={() => back()}
          onConfirm={deleteAppointment}
          message={"Are you sure you would like to delete?"}
        />
      )}
      {mode === EDIT && (
        <Form 
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}          
        />
      )}
      {mode === ERROR_SAVE && (
        <Error 
          message={"Could not save appointment"}
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message={"Could not cancel appointment"}
          onClose={() => back()}
        />
      )}
    </article>
  );
}