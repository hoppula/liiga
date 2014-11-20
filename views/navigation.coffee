React = require 'react/addons'
{Navbar, Nav, NavItem, DropdownButton, MenuItem} = require "react-bootstrap"

Teams = require '../lib/teams'

Navigation = React.createClass

  render: ->
    brand = <a href="/" className="navbar-brand">Liiga</a>

    teams =
      # disable for now, react bootstrap is buggy on mobile
      # <DropdownButton title="Joukkueet">
      #   {Object.keys(Teams.namesAndIds).map (name) ->
      #     <MenuItem key={Teams.namesAndIds[name]} href="/joukkueet/#{Teams.namesAndIds[name]}">{name}</MenuItem>
      #   }
      # </DropdownButton>
      null

    if @props.item
      item = <NavItem href={@props.item.url}>{@props.item.title}</NavItem>

    if @props.dropdown
      dropdown = <DropdownButton title={@props.dropdown.title}>
        {@props.dropdown.items.map (item) ->
          <MenuItem eventKey={item.title} href={item.url}>{item.title}</MenuItem>
        }
      </DropdownButton>

    <Navbar brand={brand} fixedTop toggleNavKey={0}>
      <Nav className="bs-navbar-collapse" eventKey={0} role="navigation">
        <NavItem href="/sarjataulukko">Sarjataulukko</NavItem>
        <NavItem href="/tilastot">Tilastot</NavItem>
        <NavItem href="/ottelut">Ottelut</NavItem>
        {teams}
        {item}
        {dropdown}
      </Nav>
    </Navbar>

module.exports = Navigation