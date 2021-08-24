export default class Server {
    static getType() {
        return "web"
    }
    constructor(conect) {
        this.listen = conect;
    }
}