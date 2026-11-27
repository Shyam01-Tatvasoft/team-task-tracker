const todayString = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

// Pure function: values in, errors object out ({} means valid)
export function validateTask(values, { isNew = true } = {}) {
  const errors = {}
  const title = values.title.trim()

  if (!title) errors.title = 'Title is required.'
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.'
  else if (title.length > 80) errors.title = 'Title must be 80 characters or fewer.'

  if (!values.assigneeId) errors.assigneeId = 'Choose an assignee.'

  if (!values.dueDate) errors.dueDate = 'Due date is required.'
  else if (isNew && values.dueDate < todayString()) {
    errors.dueDate = 'Due date cannot be in the past.'
  }

  if (values.description.length > 300) {
    errors.description = 'Description must be 300 characters or fewer.'
  }

  return errors
}