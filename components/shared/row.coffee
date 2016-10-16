React = require 'react'
classnames = require 'classnames'

Row = React.createClass

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

module.exports = Row
