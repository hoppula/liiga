import React from 'react'

export default TableSort = (options = {}) =>
  { sortField, sortDirection, sortType } = options

  return (WrappedComponent) => React.createClass

    getInitialState: ->
      sortField: sortField
      sortDirection: sortDirection
      sortType: sortType

    setSort: (field, type="integer") ->
      if field
        if @state.sortField is field
          newSort = if @state.sortDirection is "desc" then "asc" else "desc"
          @setState sortDirection: newSort, sortType: type
        else
          @setState sortField: field, sortType: type

    sort: (a, b) ->
      switch @state.sortType
        when "integer"
          if @state.sortDirection is "desc"
            (parseInt(b[@state.sortField]) || 0) - (parseInt(a[@state.sortField]) || 0)
          else
            (parseInt(a[@state.sortField]) || 0) - (parseInt(b[@state.sortField]) || 0)
        when "float"
          aValue = Number(a[@state.sortField].replace("%","").replace(/\,|\:/,".")) or 0
          bValue = Number(b[@state.sortField].replace("%","").replace(/\,|\:/,".")) or 0
          if @state.sortDirection is "desc"
            bValue - aValue
          else
            aValue - bValue
        when "string"
          if @state.sortDirection is "desc"
            if b[@state.sortField] < a[@state.sortField]
              -1
            else if b[@state.sortField] > a[@state.sortField]
              1
            else
              0
          else
            if a[@state.sortField] < b[@state.sortField]
              -1
            else if a[@state.sortField] > b[@state.sortField]
              1
            else
              0

    render: ->
      extraProps =
        sortField: @state.sortField
        sortDirection: @state.sortDirection
        sortType: @state.sortType
        setSort: @setSort
        sort: @sort
      <WrappedComponent {...extraProps} {...@props} />
