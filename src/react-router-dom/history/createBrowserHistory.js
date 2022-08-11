import ListenerManager from "./utils/ListenerManager";
import BlockManager from "./utils/BlockManager";
function createBrowserHistory(options = {}) {
  const {
    basename = "",
    forceRefresh = false,
    keyLength = 6,
    getUserConfirmation = (message, callback) =>
      callback(window.confirm(message)),
  } = options;

  const listenerManager = new ListenerManager();
  const blockManager = new BlockManager(getUserConfirmation);

  function go(num) {
    history.go(num);
  }

  function goForward() {
    history.forward();
  }
  function goBack() {
    history.back();
  }

  function push(path, state) {
    changePage(path, state, true);
  }

  function replace(path, state) {
    changePage(path, state, false);
  }
  /**
   * 对push方法和replace方法进行公共代码提取
   * @param {*} path 路径对象
   * @param {*} state 状态
   * @param {*} isPush 是否是push类型
   */

  function changePage(path, state, isPush) {
    let action = "PUSH";
    if (!isPush) {
      action = "replace";
    }
    // 获取统一处理的参数
    const pathInfo = handleState(path, state, basename);
    // 当地址发生变化的时候，location需要重新设置
    // 这里也是需要注意的，就是只有地址发生变化从history上设置location才是正常的，否则只能通过参数来生成新的location
    // const location = createLocation(basename)
    const location = createLocationFromPathInfo(pathInfo, basename);
    // 触发阻塞
    // 只有允许跳转的时候才能进行跳转
    blockManager.triggerBlock(location, action, () => {
      // 有个坑
      // 如果是强制刷新的情况，需要先保存状态到state的状态,不然状态会丢失
      if (isPush) {
        window.history.pushState(
          {
            key: createKey(keyLength),
            state: pathInfo.state,
          },
          null,
          pathInfo.path
        );
      } else {
        window.history.replaceState(
          {
            key: createKey(keyLength),
            state: pathInfo.state,
          },
          null,
          pathInfo.path
        );
      }
      // 触发listener监听函数
      listenerManager.triggerListener(location, action);
      // 小坑
      // listener监听函数出发后，才将location更新到history上，因为listener函数执行过程中，history的location还是旧值
      // 需要在地址改变后，再对location进行更新及更新action
      history.location = location;
      history.action = action;
      if (forceRefresh) {
        window.location.href = pathInfo.path;
      }
    });
  }

  addEvent();
  function addEvent() {
    // popstate方法只能监听用户在浏览器上的操作
    window.addEventListener("popstate", () => {
      const location = createLocation(basename);
      const action = "POP";
      blockManager.triggerBlock(location, action, () => {
        // 用户在浏览器上的操作，action都是POP
        listenerManager.triggerListener(location, action);
        // 在listener中history本身的location还是之前，所以需要在触发完监听函数后再赋值
        history.location = location;
      });
    });
  }

  function listen(listen) {
    listenerManager.addListener(listen);
  }

  function block(msg) {
    blockManager.block(msg)
  }


  const history = {
    go,
    goForward,
    goBack,
    push,
    replace,
    listen,
    block,
    length: window.history.length,
    action: "POP", // 默认创建的值都为POP
    location: createLocation(basename),
  };

  return history;
}
/**
 * 内部不用数组来维护栈中的location，因为挺麻烦的，需要增删改查之类的操作
 * 直接使用window.location来获取栈location的内容
 * location 有四个属性
 *          pathname
 *          search
 *          hash
 *          state
 */

function createLocation(basename) {
  // 对pathname进行处理
  let pathname = window.location.pathname;

  // 去除basename
  const reg = new RegExp(`^${basename}`);
  pathname = pathname.replace(reg, "");

  const location = {
    pathname,
    search: window.location.search,
    hash: window.location.hash,
  };

  let state,
    historyState = window.history.state;
  // 对state进行处理
  // 为什么不能直接用history中的state呢？
  // 因为还有第三方的插件会对state进行更改，我们不能直接更改别人的，给其他插件留活路
  // 直接取自己的就好, 自己的内容会存在state.state里面
  if (historyState === null) {
    state = undefined;
  } else if (typeof state === "object") {
    if ("key" in historyState) {
      state = historyState.state;
      location.key = historyState.key;
    } else {
      state = historyState;
    }
  } else {
    state = historyState;
  }

  location.state = state;

  // 对search进行处理
  // let search = location.search
  // if(search.charAt(0) !== '?') {
  //     search = '?' + search
  // }
  // let hash = location.hash
  // if(hash.charAt(0) !== '#') {
  //     hash = '#' + hash
  // }

  return location;
}

// 对传进来的参数进行统一处理
function handleState(path, state, basename) {
  if (typeof path === "string") {
    return {
      path: basename + path,
      state,
    };
  } else if (typeof path === "object") {
    let { pathname, search = "", hash = "" } = path;
    pathname = basename + pathname;
    if (search && search.chartAt(0) !== "?") {
      search = "?" + search;
    }

    if (hash && hash.chartAt(0) !== "#") {
      hash = "#" + hash;
    }
    pathname += search;
    pathname += hash;

    // 如果传进来的path是一个对象，那么第二个参数失效
    return {
      path: pathname,
      state: path.state,
    };
  }
}

/**
 * 通过路径参数生成location
 * @param {*} pathInfo
 * @return location
 */
function createLocationFromPathInfo(pathInfo, basename) {
  const { path, state } = pathInfo;

  // 去除basename
  const reg = new RegExp(`^${basename}`);
  let pathname = path.replace(reg, "");
  pathname = pathname.replace(/[?#].*/, "");

  const quesIndex = path.indexOf("?");
  const sharpIndex = path.indexOf("#");

  let search = "",
    hash = "";
  // 情况1 问号存在，且在#前
  // 情况2 问号存在，不存在#
  if (
    quesIndex >= 0 &&
    ((sharpIndex >= 0 && quesIndex < sharpIndex) || sharpIndex < 0)
  ) {
    search = path.slice(quesIndex, sharpIndex);
    hash = path.slice(sharpIndex);
  } else if (quesIndex >= 0) {
    hash = path.slice(sharpIndex);
  }

  return {
    pathname,
    search,
    hash,
    state,
  };
}

function createKey(keyLength) {
  const key = Math.random().toString(36).slice(2);
  return key.slice(0, keyLength);
}

export default createBrowserHistory;

window.h = createBrowserHistory({
  //forceRefresh: true,
});
