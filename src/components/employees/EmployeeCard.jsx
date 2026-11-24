import { Fragment } from 'react'
import Badge from '../common/Badge.jsx'

function EmployeeCard({ name, role, department, email, onLeave }) {
  const details = [
    { label: 'Department', value: department },
    { label: 'Email', value: email },
  ]

  return (
    <article className="employee-card">
      <div className="employee-card__avatar">{name.charAt(0)}</div>
      <h3 className="employee-card__name">{name}</h3>
      <p className="employee-card__role">{role}</p>
      {onLeave && <Badge variant="warning">On leave</Badge>}
      <dl className="employee-card__details">
        {details.map((item) => (
          <Fragment key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value || 'Not provided'}</dd>
          </Fragment>
        ))}
      </dl>
    </article>
  )
}

export default EmployeeCard