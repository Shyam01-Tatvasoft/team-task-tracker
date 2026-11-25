function TaskStats({ tasks }) {
    const total = tasks.length
    const todo = tasks.filter((task) => task.status === 'todo').length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const done = tasks.filter((task) => task.status === 'done').length
  
    const stats = [
      { label: 'Total', value: total },
      { label: 'To do', value: todo },
      { label: 'In progress', value: inProgress },
      { label: 'Done', value: done },
    ]
  
    return (
      <div className="task-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="task-stats__item">
            <span className="task-stats__value">{stat.value}</span>
            <span className="task-stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    )
  }
  
  export default TaskStats