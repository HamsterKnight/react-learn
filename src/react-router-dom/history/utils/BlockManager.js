export default class BlockManager {
    constructor(getUserConfirm) {
        // 定义一个属性用来接收阻塞的消息
        this.prompt = null
        // 阻塞时执行的阻塞函数
        this.getUserConfirm = getUserConfirm
    }
    block(prompt) {
        this.prompt = prompt
        return () => {
            this.prompt = null
        }
    }
    /**
     * 
     * @param {*} location 
     * @param {*} action 
     * @param {*} callback 没阻塞｜确认跳转时，需要执行的操作
     * @returns 
     */
    triggerBlock(location, action, callback) {
        // 如果没有阻塞则直接执行跳转
        if(!this.prompt) {
            // 执行跳转
            callback()
            return
        }
        let msg
        if(typeof this.prompt === 'string') {
            msg = this.prompt
        } else if(typeof this.prompt === 'function') {
            msg = this.prompt(location, action)
        }
        this.getUserConfirm(msg, (result)=> {
            if(result === true) {
                // 执行跳转
                callback()
            }
        })
    }
}