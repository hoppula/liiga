React = require 'react/addons'
classSet = React.addons.classSet

Dropdown = React.createClass

  getInitialState: ->
    open: false

  toggleOpen: (event) ->
    event.preventDefault()
    @setState open: not @state.open

  close: (event) ->
    @setState open: false

  render: ->
    classes = classSet
      'open': @state.open
      'dropdown': true

    <li className={classes}>
      <a role="button" href="#" onClick={@toggleOpen}>{@props.title} <span className="caret"></span></a>
      <ul className="dropdown-menu" role="menu">
        {@props.items.map (item) =>
          <li role="presentation" key={item.title}>
            <a role="menuitem" tabIndex="-1" href={item.url} onClick={@close}>{item.title}</a>
          </li>
        }
      </ul>
    </li>

module.exports = Dropdown