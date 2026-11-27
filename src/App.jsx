import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout.jsx'
import Card from './components/common/Card.jsx'
import Button from './components/common/Button.jsx'
import Badge from './components/common/Badge.jsx'
import SearchInput from './components/common/SearchInput.jsx'
import EmployeeList from './components/employees/EmployeeList.jsx'
import TaskStats from './components/tasks/TaskStats.jsx'
import TaskList from './components/tasks/TaskList.jsx'
import TaskFilters from './components/tasks/TaskFilters.jsx'
import { getNextStatus, sortTasks, SORT_OPTIONS } from './utils/taskStatus.js'
import EmptyState from './components/common/EmptyState.jsx'
import { newHires } from './data/employees.js'
import { fetchEmployees, fetchTasks, subscribeToNotifications } from './services/api.js'
import TaskSearch from './components/tasks/TaskSearch.jsx'
import LastUpdated from './components/common/LastUpdated.jsx'
import TaskForm from './components/tasks/TaskForm.jsx'


// Pure helper: returns the same list if the hire already exists
function addHire(list, hire) {
  if (list.some((employee) => employee.id === hire.id)) return list
  return [...list, hire]
}

function App() {
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [searchText, setSearchText] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('due')
  const [notifications, setNotifications] = useState([])
  // null = form closed, 'new' = creating, a number = editing that task id
  const [formTarget, setFormTarget] = useState(null)

  // ---- Derived values: computed every render, never stored in state ----
  const query = searchText.trim().toLowerCase()
  const visibleEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(query)
  )

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null

  const missingHires = newHires.filter(
    (hire) => !employees.some((employee) => employee.id === hire.id)
  )
  const nextHire = missingHires[0]
  const onLeaveCount = employees.filter((employee) => employee.onLeave).length

  const visibleTasks = sortTasks(
    tasks.filter(
      (task) =>
        (statusFilter === 'all' || task.status === statusFilter) &&
        (priorityFilter === 'all' || task.priority === priorityFilter)
    ),
    sortBy
  )

  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all'

  const editingTask =
  typeof formTarget === 'number'
    ? tasks.find((task) => task.id === formTarget) ?? null
    : null
  
  // 1. Load data on mount (and again when reloadCount changes)
  useEffect(() => {
    let ignore = false

    Promise.all([fetchEmployees(), fetchTasks()])
      .then(([employeeData, taskData]) => {
        if (ignore) return
        setEmployees(employeeData)
        setTasks(taskData)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true // cleanup: discard results from an outdated run
    }
  }, [reloadCount])

  // 2. Keep the tab title in sync (no cleanup needed)
  const openTaskCount = tasks.filter((task) => task.status !== 'done').length
  useEffect(() => {
    document.title = `(${openTaskCount}) Team Task Tracker`
  }, [openTaskCount])

  // 3. Subscribe to browser events (cleanup is required)
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // 4. Subscribe to live notifications
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 5))
    })
    return unsubscribe
  }, [])
  // ----------------------------------------------------------------------

  function handleViewProfile(employeeId) {
    setSelectedEmployeeId(employeeId)
  }

  function handleToggleLeave(employeeId) {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === employeeId
          ? { ...employee, onLeave: !employee.onLeave }
          : employee
      )
    )
  }

  function handleRemove(employeeId) {
    setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId))
  }

  function handleAddSampleHire() {
    if (!nextHire) return
    setEmployees((prev) => addHire(prev, nextHire))
  }

  function handleAddAllHires() {
    newHires.forEach((hire) => {
      setEmployees((prev) => addHire(prev, hire))
    })
  }

  function handleMarkAllAvailable() {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.onLeave ? { ...employee, onLeave: false } : employee
      )
    )
  }

  function handleAdvanceStatus(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: getNextStatus(task.status) ?? task.status }
          : task
      )
    )
  }

  function handleClearFilters() {
    setStatusFilter('all')
    setPriorityFilter('all')
  }

  function handleSaveTask(values) {
    if (formTarget === 'new') {
      setTasks((prev) => {
        const nextId = Math.max(0, ...prev.map((task) => task.id)) + 1
        return [...prev, { id: nextId, ...values }]
      })
    } else {
      setTasks((prev) =>
        prev.map((task) => (task.id === formTarget ? { ...task, ...values } : task))
      )
    }
    setFormTarget(null)
  }
  
  function handleDeleteTask(taskId) {
    // window.confirm is a placeholder; Phase 10 replaces it with a reusable dialog
    if (!window.confirm('Delete this task?')) return
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    if (formTarget === taskId) setFormTarget(null)
  }

  function handleRetry() {
    setIsLoading(true)
    setError(null)
    setReloadCount((count) => count + 1) // changes the dependency, so effect 1 re-runs
  }
  
  if (isLoading) {
    return (
      <Layout title="Dashboard" userName="Priya Sharma">
        <p className="loading-text">Loading dashboard...</p>
      </Layout>
    )
  }
  
  if (error) {
    return (
      <Layout title="Dashboard" userName="Priya Sharma">
        <EmptyState title="Could not load data" message={error} />
        <Button onClick={handleRetry}>Retry</Button>
      </Layout>
    )
  }

  return (
    <Layout title="Dashboard" userName="Shyam Pankhaniya">
      {!isOnline && (
        <div className="offline-banner">You are offline. Changes stay local.</div>
      )}
      <div className="dashboard-grid">
        <Card title="Task Overview">
          <TaskStats tasks={tasks} />
          <LastUpdated />
        </Card>
        <Card title="Team Activity">
          {notifications.length === 0 ? (
            <p>Waiting for activity...</p>
          ) : (
            <ul className="activity-list">
              {notifications.map((item) => (
                <li key={item.id}>{item.message}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Selected Employee">
          {selectedEmployee ? (
            <div className="selected-employee">
              <p className="selected-employee__name">{selectedEmployee.name}</p>
              <p>{selectedEmployee.role}</p>
              <p>{selectedEmployee.email}</p>
              {selectedEmployee.onLeave && (
                <Badge variant="warning">On leave</Badge>
              )}
              <Button
                variant="secondary"
                onClick={() => setSelectedEmployeeId(null)}
              >
                Clear selection
              </Button>
            </div>
          ) : (
            <p>Click "View profile" on a team member.</p>
          )}
        </Card>
      </div>

      <div className="dashboard-section">
        <Card title="Tasks">
          {formTarget === null ? (
            <div className="card-actions">
              <Button onClick={() => setFormTarget('new')}>+ New task</Button>
            </div>
          ) : (
            <TaskForm
              key={formTarget}
              employees={employees}
              initialTask={editingTask}
              onSubmit={handleSaveTask}
              onCancel={() => setFormTarget(null)}
            />
          )}
          <TaskSearch />
          <TaskFilters
            tasks={tasks}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
          />
          <div className="task-summary">
            <span>Showing {visibleTasks.length} of {tasks.length} tasks</span>
            <div className="task-summary__controls">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort tasks"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
              {hasActiveFilters && (
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          </div>
          <TaskList
            tasks={visibleTasks}
            employees={employees}
            onAdvanceStatus={handleAdvanceStatus}
            emptyTitle={
              tasks.length === 0 ? 'No tasks yet' : 'No tasks match these filters'
            }
            emptyMessage={
              tasks.length === 0
                ? 'Tasks you create will appear here.'
                : 'Try a different status or priority.'
            }
            onEdit={setFormTarget}
            onDelete={handleDeleteTask}
          />
        </Card>
      </div>

      <div className="dashboard-section">
        <Card title="Team Members">
          <div className="toolbar">
          <div className="search-row">
              <SearchInput
                placeholder="Search by name..."
                value={searchText}
                onChange={setSearchText}
              />
              {searchText && (
                <Button variant="secondary" onClick={() => setSearchText('')}>
                  Clear
                </Button>
              )}
            </div>
            <div className="toolbar__actions">
              {onLeaveCount > 0 && (
                <Button variant="secondary" onClick={handleMarkAllAvailable}>
                  Mark all available ({onLeaveCount})
                </Button>
              )}
              {missingHires.length > 1 && (
                <Button variant="secondary" onClick={handleAddAllHires}>
                  Add all {missingHires.length} hires
                </Button>
              )}
              <Button onClick={handleAddSampleHire}>
                {nextHire ? `Add ${nextHire.name}` : 'No more sample hires'}
              </Button>
            </div>
          </div>
          <EmployeeList
            employees={visibleEmployees}
            isLoading={false}
            onViewProfile={handleViewProfile}
            onToggleLeave={handleToggleLeave}
            onRemove={handleRemove}
            emptyTitle={
              employees.length === 0
                ? 'No team members yet'
                : 'No matching employees'
            }
            emptyMessage={
              employees.length === 0
                ? 'Use the add button to bring someone in.'
                : 'Try a different name.'
            }
          />
        </Card>
      </div>
    </Layout>
  )
}

export default App