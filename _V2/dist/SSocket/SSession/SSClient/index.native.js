import TcpSocket from "../../../Tcp-Socket/index";
var SSClient = /** @class */ (function () {
    function SSClient(props, SSession) {
        this.props = props;
        this.SSession = SSession;
        // if (this.props.ssl) {
        //     this.url = "wss://" + this.props.host + "/ws/";
        // } else {
        //     this.url = "ws://" + this.props.host + ":" + this.props.port.web + "/"
        // }
    }
    SSClient.prototype.isOpen = function () {
        if (!this.socket)
            return false;
        if (this.socket._destroyed) {
            return false;
        }
        return true;
    };
    SSClient.prototype.open = function () {
        var _this = this;
        if (this.isOpen()) {
            return;
        }
        var cert_begin = "-----BEGIN CERTIFICATE-----\n";
        var end_cert = "\n-----END CERTIFICATE-----";
        var cerdata = this.props.cert;
        var pem = cert_begin + cerdata + end_cert;
        var _instance = this;
        this.socket = TcpSocket.createConnection({
            port: this.props.port.native,
            host: this.props.host,
            timeout: 2000,
            tls: true,
            tlsCert: pem
        }, function () {
            _this.SSession.onOpen();
        });
        this.socket.on('timeout', function () {
            // _instance.SSession.onError("timeout");
        });
        this.socket.on('data', function (data) {
            _instance.SSession.onMessage(data);
        });
        this.socket.on('error', function (error) {
            _instance.SSession.onError(error);
        });
        this.socket.on('close', function () {
            _instance.SSession.onClose();
        });
        this.socket.onmessage = function (evt) {
            _instance.SSession.onMessage(evt.data);
        };
    };
    SSClient.prototype.close = function () {
        this.socket.end();
        this.socket.destroy();
        this.socket = null;
    };
    SSClient.prototype.send = function (data) {
        if (!this.socket) {
            return;
        }
        this.socket.write(data + "\n");
        // store.dispatch(obj);
    };
    return SSClient;
}());
export default SSClient;
