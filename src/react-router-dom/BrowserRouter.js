import React from 'react'
import { Router } from '../react-router'
import { createBrowserHistory } from './history'

export default class BrowserRouter extends React.Component {
    // history一直都是不变的, 所以存在属性里面即可
    history = createBrowserHistory(this.props)

    render() {
        return <Router history={this.history}>
            {this.props.children}
        </Router>
    }
}