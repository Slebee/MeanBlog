/*
import React from 'react';

class NavBar extends React.Component{
    render() {
        return (
            <img alt={this.props.caption} src={this.props.src} />
        )
    }
}*/
var NavBar = React.createClass({
    render:function(){
        return <h1>hei</h1>
    }
});

ReactDOM.render(
    <NavBar />,
    document.body
)