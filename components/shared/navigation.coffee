import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap"

import Teams from '../../lib/teams'

export default Navigation = React.createClass
  getInitialState: ->
    expanded: false

  toggleExpanded: (value) ->
    @setState expanded: value

  render: ->
    teams =
      <NavDropdown id="joukkueet" title="Joukkueet">
        {Object.keys(Teams.namesAndIds).map (name) =>
          <MenuItem key={Teams.namesAndIds[name]} href="/joukkueet/#{Teams.namesAndIds[name]}" onClick={() => @toggleExpanded(false)}>{name}</MenuItem>
        }
      </NavDropdown>

    if @props.item
      item = <NavItem href={@props.item.url}>{@props.item.title}</NavItem>

    if @props.dropdown
      dropdown = <NavDropdown id="pelaajat" title={@props.dropdown.title}>
        {@props.dropdown.items.map (item) ->
          <MenuItem key={item.title} href={item.url}>{item.title}</MenuItem>
        }
      </NavDropdown>

    <Navbar fixedTop expanded={@state.expanded} onToggle={this.toggleExpanded}>
     <Navbar.Header>
        <Navbar.Brand>
          <a href="/" className="navbar-brand">LiigaOpas</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem href="/sarjataulukko">Sarjataulukko</NavItem>
          <NavItem href="/tilastot">Tilastot</NavItem>
          <NavItem href="/ottelut">Ottelut</NavItem>
          {teams}
          {item}
          {dropdown}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
