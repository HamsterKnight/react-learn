export default class ListenerManager {
    constructor() {
        this.listener = []
    }
    // 增加监听函数
    addListener(listener) {
        this.listener.push(listener)
        return () => {
            const index = this.listener.indexOf(listener)
            this.listener.splice(index, 1)
        }
    }
    // 触发所有的监听函数
    triggerListener(location, action) {
        this.listener.forEach(listener => listener(location, action))
    }
}