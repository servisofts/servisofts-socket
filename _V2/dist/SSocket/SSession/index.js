var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { SThread } from 'servisofts-component';
import SSClient from './SSClient/index';
var SSession = /** @class */ (function () {
    function SSession(props) {
        this.timePing = 10 * (1000); // time * (milliseconds)
        this.timeReconect = 2 * (1000); // time * (milliseconds)
        this.timeReintent = 5 * (1000); // time * (milliseconds)
        this.mensajeTemp = "";
        this.props = props;
        this.log("Instanciando el socket");
        this.log("props", JSON.stringify(props, null, "\t"));
        this.socket = new SSClient(props, this);
    }
    SSession.prototype.isOpen = function () {
        return this.socket.isOpen();
    };
    SSession.prototype.init = function (instance) {
        this.log("Init");
        this.ssocketInstance = instance;
        this.socket.open();
    };
    SSession.prototype.ping = function () {
        var _this = this;
        new SThread(this.timePing, "hiloSocket_ping_" + this.props.name, true).start(function () {
            if (!_this.isOpen()) {
                return;
            }
            if (!_this)
                return;
            if (!_this.identificado) {
                if (!_this.identificarse)
                    return;
                _this.identificarse();
            }
            _this.socket.open();
            // this.log("ping");
            _this.ping();
        });
    };
    SSession.prototype.reconect = function () {
        var _this = this;
        new SThread(this.timeReconect, "hiloSocket_reconect_" + this.props.name, true).start(function () {
            if (_this.isOpen()) {
                return;
            }
            _this.log("intentando reconectar...");
            _this.socket.open();
            _this.reconect();
        });
    };
    SSession.prototype.indentificarse = function () {
        var usr = false;
        var deviceKey = "deviceKey";
        var objSend = {
            component: "usuario",
            type: "identificacion",
            data: usr,
            deviceKey: deviceKey,
            estado: "cargando"
        };
        this.send(objSend);
    };
    SSession.prototype.reintent = function (obj) {
        var _this = this;
        if (typeof obj != 'object') {
            try {
                obj = JSON.parse(obj);
            }
            catch (e) {
                this.log("ERROR", "notifyRedux error al convertir el mensaje a JSON");
                return;
            }
        }
        new SThread(this.timeReintent, "hilo_reintent" + obj.component, true).start(function () {
            obj.estado = "";
            _this.notifyRedux(obj);
        });
    };
    SSession.prototype.send = function (msn) {
        var str = msn;
        if (typeof msn == 'object') {
            str = JSON.stringify(msn);
        }
        if (!this.socket) {
            return;
        }
        this.socket.send(str);
        this.notifyRedux(str);
        this.reintent(str);
    };
    SSession.prototype.onOpen = function () {
        this.ping();
        this.identificado = false;
        this.indentificarse();
        this.log("onOpen");
    };
    SSession.prototype.onClose = function () {
        this.log("onClose");
        this.reconect();
        this.identificado = false;
    };
    SSession.prototype.onError = function (evt) {
        this.log("onError", JSON.stringify(evt));
    };
    SSession.prototype.notifyRedux = function (obj) {
        if (typeof obj != 'object') {
            try {
                obj = JSON.parse(obj);
            }
            catch (e) {
                this.log("ERROR", "notifyRedux error al convertir el mensaje a JSON");
                return;
            }
        }
        if (!this.ssocketInstance) {
            this.log("ERROR", "No hay ssocketInstance, No se pudo hacer dispatch del mensaje.");
            return;
        }
        this.ssocketInstance.props.dispatch(obj);
    };
    SSession.prototype.onMessage = function (msn) {
        this.mensajeTemp += msn;
        if (/---SSofts---/.test(msn)) {
            this.mensajeTemp = this.mensajeTemp.replace(/---SSofts---/, '');
            var arr = this.mensajeTemp.split("---SSkey---");
            this.mensajeTemp = ""; // reset cola;
            var mensaje = arr[0]; //data
            var key = arr[1]; // SSkey
            this.log("onMessage", "\n", mensaje);
            try {
                var obj = JSON.parse(mensaje);
                this.notifyRedux(obj);
                this.manejadorInterno(obj);
            }
            catch (e) {
                this.log("onMessage Error", e);
            }
        }
    };
    SSession.prototype.manejadorInterno = function (obj) {
        if (!obj.component)
            return;
        switch (obj.component) {
            case "usuario":
                switch (obj.type) {
                    case "identificacion":
                        if (obj.estado == "exito") {
                            this.identificado = true;
                            this.log("identificado con exito");
                            return;
                        }
                    default: return;
                }
            default: return;
        }
    };
    SSession.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(['SSession::' + this.props.name + ':'], args, false));
        if (!this.ssocketInstance)
            return;
        var msn = this.props.name + ':';
        for (var i = 0; i < arguments.length; i++) {
            msn += arguments[i];
        }
        this.ssocketInstance.state.log.push(msn);
        this.ssocketInstance.setState({ log: this.ssocketInstance.state.log });
    };
    return SSession;
}());
export default SSession;
