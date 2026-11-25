import TaskItem from './TaskItem.jsx'
import EmptyState from '../common/EmptyState.jsx'

function TaskList({ tasks, employees, onAdvanceStatus }) {
  if (tasks.length === 0) {
    return (
      <EmptyState title="No tasks yet" message="Tasks you create will appear here." />
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const assignee = employees.find((employee) => employee.id === task.assigneeId)

        return (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            status={task.status}
            priority={task.priority}
            assigneeName={assignee ? assignee.name : 'Unassigned'}
            dueDate={task.dueDate}
            onAdvanceStatus={onAdvanceStatus}
          />
        )
      })}
    </ul>
  )
}

export default TaskList