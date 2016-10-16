React = require 'react'

Column = React.createClass

  render: ->
    <td className={@props.className}>
      {@props.children}
    </td>

module.exports = Column
