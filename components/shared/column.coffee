import React from 'react'

export default Column = React.createClass
  render: ->
    <td className={@props.className}>
      {@props.children}
    </td>
