React = require 'react/addons'
Dropdown = require './components/dropdown'

{Navbar, Nav, NavItem, DropdownButton, MenuItem} = require "react-bootstrap"

Navigation = React.createClass

  render: ->
    brand = <a href="/" className="navbar-brand">Liiga</a>

    if @props.team
      console.log "team", @props.team
      team = <NavItem href={@props.team.info.url}>{@props.team.info.name}</NavItem>

    if @props.dropdown
      dropdown = <DropdownButton title={@props.dropdown.title} onSelect={->}>
        {@props.dropdown.items.map (item) ->
          <MenuItem key={item.title} href={item.url}>{item.title}</MenuItem>
        }
      </DropdownButton>

    <Navbar brand={brand} fixedTop toggleNavKey={0}>
      <Nav className="bs-navbar-collapse" key={0} role="navigation">
        {team}
        {dropdown}
      </Nav>
    </Navbar>

module.exports = Navigation