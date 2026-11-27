import { useState } from 'react'
import Button from '../common/Button.jsx'
import { validateTask } from '../../utils/validateTask.js'
import {
  STATUS_FILTERS,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from '../../utils/taskStatus.js'

const STATUSES = STATUS_FILTERS.filter((status) => status !== 'all')
const PRIORITIES = ['high', 'medium', 'low']

function Field({ label, name, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={`task-${name}`}>{label}</label>
      {children}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function TaskForm({ employees, initialTask = null, onSubmit, onCancel }) {
  const isEdit = initialTask !== null

  const [values, setValues] = useState({
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    assigneeId: initialTask?.assigneeId ? String(initialTask.assigneeId) : '',
    priority: initialTask?.priority ?? 'medium',
    status: initialTask?.status ?? 'todo',
    dueDate: initialTask?.dueDate ?? '',
  })
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Derived on every render, never stored
  const errors = validateTask(values, { isNew: !isEdit })
  const errorFor = (name) => (touched[name] || submitAttempted ? errors[name] : null)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault() // stop the browser's full-page form submit
    setSubmitAttempted(true)
    if (Object.keys(errors).length > 0) return

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      assigneeId: Number(values.assigneeId), // select values are always strings
      priority: values.priority,
      status: values.status,
      dueDate: values.dueDate,
    })
  }

  const common = { onChange: handleChange, onBlur: handleBlur }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h3 className="task-form__title">{isEdit ? 'Edit task' : 'New task'}</h3>

      <div className="form-grid">
        <Field label="Title" name="title" error={errorFor('title')}>
          <input
            id="task-title"
            name="title"
            className="form-control"
            value={values.title}
            aria-invalid={Boolean(errorFor('title'))}
            {...common}
          />
        </Field>

        <Field label="Assignee" name="assigneeId" error={errorFor('assigneeId')}>
          <select
            id="task-assigneeId"
            name="assigneeId"
            className="form-control"
            value={values.assigneeId}
            aria-invalid={Boolean(errorFor('assigneeId'))}
            {...common}
          >
            <option value="">Select an employee...</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
                {employee.onLeave ? ' (on leave)' : ''}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" name="priority">
          <select
            id="task-priority"
            name="priority"
            className="form-control"
            value={values.priority}
            {...common}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" name="status">
          <select
            id="task-status"
            name="status"
            className="form-control"
            value={values.status}
            {...common}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Due date" name="dueDate" error={errorFor('dueDate')}>
          <input
            id="task-dueDate"
            name="dueDate"
            type="date"
            className="form-control"
            value={values.dueDate}
            aria-invalid={Boolean(errorFor('dueDate'))}
            {...common}
          />
        </Field>
      </div>

      <Field label="Description (optional)" name="description" error={errorFor('description')}>
        <textarea
          id="task-description"
          name="description"
          className="form-control"
          rows={3}
          value={values.description}
          {...common}
        />
      </Field>

      <div className="form-actions">
        <Button type="submit">{isEdit ? 'Save changes' : 'Create task'}</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default TaskForm