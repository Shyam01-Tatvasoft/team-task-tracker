import { Fragment } from 'react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

function EmployeeCard({
  id,
  name,
  role,
  department,
  email,
  onLeave,
  onViewProfile,
  onToggleLeave,
  onRemove,
}) {
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
      <div className="employee-card__actions">
        <Button variant="secondary" onClick={() => onViewProfile(id)}>
          View profile
        </Button>
        <Button variant="secondary" onClick={() => onToggleLeave(id)}>
          {onLeave ? 'Mark available' : 'Mark on leave'}
        </Button>
        <Button variant="danger" onClick={() => onRemove(id)}>
          Remove
        </Button>
      </div>
    </article>
  )
}

export default EmployeeCard