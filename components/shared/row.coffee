import React from 'react'
import classnames from 'classnames'

export default Row = React.createClass
  render: ->
    <tr key={@props.key} className={@props.className}>
      {
        React.Children.map(@props.children, (column) =>
          selected = column.props.name is @props.sortField
          className = classnames({
            selected: selected
          }, column.props.className)
          return React.cloneElement(column, {className: className})
        )
      }
    </tr>
