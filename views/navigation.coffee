React = require 'react/addons'
Dropdown = require './components/dropdown'

Navigation = React.createClass

  render: ->
    <div className="navbar navbar-default navbar-fixed-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <a href="/" className="navbar-brand">Liiga</a>
        </div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            {<Dropdown title={@props.dropdown.title} items={@props.dropdown.items} /> if @props.dropdown}
          </ul>
        </div>
      </div>
    </div>

module.exports = Navigation