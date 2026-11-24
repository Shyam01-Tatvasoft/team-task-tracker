import Layout from './components/layout/Layout.jsx'
import Card from './components/common/Card.jsx'
import EmployeeList from './components/employees/EmployeeList.jsx'
import { employees } from './data/employees.js'

function App() {
  function handleViewProfile(employeeId) {
    const employee = employees.find((e) => e.id === employeeId)
    console.log('View profile clicked:', employee)
  }

  function handleSearchChange(searchText) {
    console.log('Search text:', searchText)
  }

  return (
    <Layout title="Dashboard" userName="Priya Sharma">
      <div className="dashboard-grid">
        <Card title="Task Overview">
          <p>Task statistics will appear here.</p>
        </Card>
        <Card title="Team Activity">
          <p>Recent activity will appear here.</p>
        </Card>
      </div>
      <div className="dashboard-section">
        <Card title="Team Members">
          <EmployeeList
            employees={employees}
            isLoading={false}
            onViewProfile={handleViewProfile}
            onSearchChange={handleSearchChange}
          />
        </Card>
      </div>
    </Layout>
  )
}

export default App