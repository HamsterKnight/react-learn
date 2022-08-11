/**
 * Router接收一个history属性
 * 
 * 提供提供一个上下文 Router.Provider组件，上下文内容为Router
 */
import React from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

export default class Router extends React.Component  {
    // 之所以要把location放在state里，是因为location发生变化时, 需要触发组件的重新渲染
    state = {
        location: this.props.history.location
    }
    
    componentDidMount() {
        // 监听地址发生变化时，触发location的更新，同时触发组件的重新渲染
        this.unListen = this.props.history.listen((location, action) => {
            this.props.history.action = action
            this.setState({
                location
            })
        })
    }
    // 组件要卸载时，移除监听
    componentWillUnmount() {
        this.unListen()
    }


    render() {
        // 需要创建一个新的对象，不然组件不会更新渲染
        const contentValue = {
            history: this.props.history,
            location: this.state.location,
            // 初始化的匹配，都是固定的
            match: matchPath('/', this.state.location.pathname) 
        }

        return <RouterContext.Provider value={contentValue}>
            {this.props.children}
        </RouterContext.Provider>
    }
}