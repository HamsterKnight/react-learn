/**
 * 用来消耗Router传递下来的上下文
 * 并往下传递匹配的match内容
 * 并决定渲染的内容
 *
 * 渲染规则如下
 * 1. 有children时，无论路径是否匹配都会渲染children，忽略render及component
 * 2. 当路径匹配时，如果有render函数，则渲染render函数内容，忽略component
 * 3. 当路径匹配时，没有render函数，则会渲染component
 */
import React, { Component } from "react";
import matchPath from "./matchPath";
import ctx from "./RouterContext";

export default class Route extends Component {
  // 用来消耗上下问，并注入新的上下文内容
  consumerFunc = (values) => {
    const match = this.getMatch(values.location);
    const ctxValue = {
      history: values.history,
      location: values.location,
      match,
    };
    if (this.props.children !== undefined && this.props.children !== null) {
      if (typeof children !== "function") {
        return this.props.children;
      } else {
        return this.props.children(ctxValue);
      }
    }

    // 路径不匹配,直接返回null
    if (!match) {
      return null;
    }
    // 路径匹配的情况
    if (typeof this.props.render === "function") {
      return this.props.render(ctxValue);
    }

    // console.log('this.props.path', this.props.path)
    if (this.props.component) {
      const Component = this.props.component;
      return <Component {...ctxValue} />;
    }

    return null;
  };
  // 根据路径得到新match对象
  getMatch(location) {
    const { sensitive = false, exact = false, strict = false } = this.props;
    const match = matchPath(this.props.path || "/", location.pathname, {
      sensitive,
      exact,
      strict,
    });
    return match;
  }

  render() {
    return <ctx.Consumer>{this.consumerFunc}</ctx.Consumer>;
  }
}
