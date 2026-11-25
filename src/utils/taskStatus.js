const STATUS_FLOW = ['todo', 'in-progress', 'done']

export const STATUS_LABELS = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export const STATUS_VARIANTS = {
  todo: 'neutral',
  'in-progress': 'info',
  done: 'success',
}

export const PRIORITY_VARIANTS = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
}

// Returns the next status, or null if the task is already done
export function getNextStatus(status) {
  const index = STATUS_FLOW.indexOf(status)
  return STATUS_FLOW[index + 1] ?? null
}