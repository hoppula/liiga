React = require 'react'
SortAsc = require 'react-icons/lib/fa/sort-asc'
SortDesc = require 'react-icons/lib/fa/sort-desc'

SortIcon = ({ direction }) ->
  <span className={direction}>
    {
      switch direction
        when "asc" then <SortAsc />
        when "desc" then <SortDesc />
        else <span />
    }
  </span>

HeaderColumn = React.createClass

  getDefaultProps: ->
    type: "integer"

  onClick: ->
    @props.onClick @props.sort, @props.type

  render: ->
    <th className={@props.className} onClick={@onClick}>
      <SortIcon direction={@props.sortDirection} />
      {@props.children}
    </th>

module.exports = HeaderColumn
