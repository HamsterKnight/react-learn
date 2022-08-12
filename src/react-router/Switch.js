import React, { Component } from "react";
import matchPath from "./matchPath";
import ctx from './RouterContext'
export default class Switch extends Component {
  getMatchChildren = (location) => {
    // 因为是要对孩子进行遍历处理
    // 所以最好对传入的孩子进行类型判断统一处理成数组
    let children = [];
    // 当有多个孩子时,this.props.children是一个数组
    if (Array.isArray(this.props.children)) {
      children = this.props.children;
    } else if (typeof this.props.children === 'object') {
      // 只有一个孩子是，this.props.children是一个对象
      children = [this.props.children];
    }
    for (const child of children) {
      // 如果孩子不是Route类型就报错
      if(child.type.name !== 'Route') {
        throw new Error('the child of Switch must be typeof Route')
      }
      // 从孩子中取出对应匹配的属性
      const {
        props: { path, sensitive = false, exact = false, strict = false },
      } = child;
      // 这里匹配需要用到路径所以，需要需要上下文中传入的location
      const result = matchPath(path || '/', location.pathname, {
        sensitive,
        exact,
        strict
      })
      // 如果匹配了，则直接返回对应的孩子，不再往下继续匹配
      if(result) {
        return child
      }
    }
    return null
  }
  render() {
    return <ctx.Consumer>
        {
            value => {
                return this.getMatchChildren(value.location)
            }
        }
    </ctx.Consumer>;
  }
}
