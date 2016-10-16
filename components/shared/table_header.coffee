React = require 'react'
classnames = require 'classnames'

TableHeader = React.createClass

  render: ->
    direction = @props.sortDirection
    <thead className="sortable-thead">
      <tr>
        {
          React.Children.map(@props.children, (column) =>
            active = column.props.sort is @props.sortField
            className = classnames({
              selected: active
            }, column.props.className)
            return React.cloneElement(column, {
              className: className,
              onClick: @props.onClick,
              sortDirection: if active and direction then direction else null
            })
          )
        }
      </tr>
    </thead>

module.exports = TableHeader
