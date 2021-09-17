var SSClient = /** @class */ (function () {
    function SSClient(props, SSession) {
        this.props = props;
        this.SSession = SSession;
        if (this.props.ssl) {
            this.url = "wss://" + this.props.host + "/ws/";
        }
        else {
            this.url = "ws://" + this.props.host + ":" + this.props.port.web + "/";
        }
    }
    SSClient.prototype.isOpen = function () {
        if (!this.socket)
            return false;
        return this.socket.readyState === 1;
    };
    SSClient.prototype.open = function () {
        var _this = this;
        if (this.isOpen()) {
            return;
        }
        this.socket = new WebSocket(this.url);
        this.socket.onopen = function () { return _this.SSession.onOpen(); };
        this.socket.onclose = function () { return _this.SSession.onClose(); };
        this.socket.onerror = function (evt) { return _this.SSession.onError(evt); };
        this.socket.onmessage = function (evt) {
            _this.SSession.onMessage(evt.data);
        };
    };
    SSClient.prototype.close = function () {
        this.socket.close();
        this.socket = null;
    };
    SSClient.prototype.send = function (data) {
        if (!this.socket) {
            return;
        }
        this.socket.send(data + "\n");
        // store.dispatch(obj);
    };
    return SSClient;
}());
export default SSClient;
