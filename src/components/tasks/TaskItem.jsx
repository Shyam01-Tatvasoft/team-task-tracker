import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import {
  STATUS_LABELS,
  STATUS_VARIANTS,
  PRIORITY_VARIANTS,
  getNextStatus,
} from '../../utils/taskStatus.js'

function TaskItem({
  id,
  title,
  status,
  priority,
  assigneeName,
  dueDate,
  onAdvanceStatus,
}) {
  const nextStatus = getNextStatus(status)

  return (
    <li className="task-item">
      <div className="task-item__main">
        <p className="task-item__title">{title}</p>
        <p className="task-item__meta">
          {assigneeName} · Due {dueDate}
        </p>
      </div>
      <div className="task-item__badges">
        <Badge variant={PRIORITY_VARIANTS[priority]}>{priority}</Badge>
        <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
      </div>
      {nextStatus && (
        <Button variant="secondary" onClick={() => onAdvanceStatus(id)}>
          Move to {STATUS_LABELS[nextStatus]}
        </Button>
      )}
    </li>
  )
}

export default TaskItem