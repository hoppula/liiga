import React from 'react'
import SortAsc from 'react-icons/lib/fa/sort-asc'
import SortDesc from 'react-icons/lib/fa/sort-desc'

SortIcon = ({ direction }) ->
  <span className={direction}>
    {
      switch direction
        when "asc" then <SortAsc />
        when "desc" then <SortDesc />
        else <span />
    }
  </span>

export default HeaderColumn = React.createClass
  getDefaultProps: ->
    type: "integer"

  onClick: ->
    @props.onClick @props.sort, @props.type

  render: ->
    <th className={@props.className} onClick={@onClick}>
      <SortIcon direction={@props.sortDirection} />
      {@props.children}
    </th>
