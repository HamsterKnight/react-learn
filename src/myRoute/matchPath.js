/**
 * 主要返回route中注入的match信息
 * match包含的信息
 * isExact 收否精准匹配，也就是匹配的路径跟正则是否完全匹配
 * path 当前路由的匹配路由
 * url 当前正则匹配的路由地址
 * 
 */
import { pathToRegexp } from "path-to-regexp";

export function mathPath(pathReg, pathname, options = {}) {
    // 获取路由匹配的默认的配置
    const opts = getOpts(options)
    // 获取匹配的key
    let keys = []
    // 根据路由路径得到正则表达式
    const reg = pathToRegexp(pathReg, keys, opts)
    const result = reg.exec(pathname)
    // 如果没有匹配则返回空
    if(!result) {
        return null
    }
    // 如果有匹配路由
    const paramsKeys = result.slice(1)
    //1.组合返回的params
    const params = {}
    for(let i = 0; i >=0 ;i--) {
        params[keys[i].name] = paramsKeys[i] 
    }
    return {
        isExact: keys.length === paramsKeys.length,
        params: params,
        path: pathReg,
        url: pathname
    }
    
}

function getOpts(opts) {
    
    const baseOptions = {
        sensitive:  false,
        strict: false,
        exact: true
    }
    
    const options = {
        ...baseOptions,
        ...opts
    }

    return {
        sensitive: options.sensitive,
        strict: options.sensitive,
        end: options.exact
    }
}

// mathPath('/A/:b', '/A/123', {
//     exact: true
// })