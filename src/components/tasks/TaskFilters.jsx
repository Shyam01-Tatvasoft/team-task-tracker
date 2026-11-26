import {
    STATUS_FILTERS,
    PRIORITY_FILTERS,
    STATUS_LABELS,
    PRIORITY_LABELS,
  } from '../../utils/taskStatus.js'
  
  function FilterGroup({ label, options, active, onChange, getLabel, getCount }) {
    return (
      <div className="filter-group">
        <span className="filter-group__label">{label}</span>
        <div className="filter-group__options">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip ${active === option ? 'chip--active' : ''}`}
              aria-pressed={active === option}
              onClick={() => onChange(option)}
            >
              {getLabel(option)}
              {getCount && <span className="chip__count">{getCount(option)}</span>}
            </button>
          ))}
        </div>
      </div>
    )
  }
  
  function TaskFilters({
    tasks,
    statusFilter,
    priorityFilter,
    onStatusChange,
    onPriorityChange,
  }) {
    function countByStatus(status) {
      return status === 'all'
        ? tasks.length
        : tasks.filter((task) => task.status === status).length
    }
  
    return (
      <div className="task-filters">
        <FilterGroup
          label="Status"
          options={STATUS_FILTERS}
          active={statusFilter}
          onChange={onStatusChange}
          getLabel={(option) => (option === 'all' ? 'All' : STATUS_LABELS[option])}
          getCount={countByStatus}
        />
        <FilterGroup
          label="Priority"
          options={PRIORITY_FILTERS}
          active={priorityFilter}
          onChange={onPriorityChange}
          getLabel={(option) => (option === 'all' ? 'All' : PRIORITY_LABELS[option])}
        />
      </div>
    )
  }
  
  export default TaskFilters