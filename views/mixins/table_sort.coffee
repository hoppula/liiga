TableSortMixin =
  setSort: (event) ->
    sort = event.target.dataset.sort
    if sort
      type = event.target.dataset.type or "integer"
      if @state.sortField is sort
        newSort = if @state.sortDirection is "desc" then "asc" else "desc"
        @setState sortDirection: newSort, sortType: type
      else
        @setState sortField: sort, sortType: type

  sort: (a, b) ->
    switch @state.sortType
      when "integer"
        if @state.sortDirection is "desc"
          b[@state.sortField] - a[@state.sortField]
        else
          a[@state.sortField] - b[@state.sortField]
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

module.exports = TableSortMixin