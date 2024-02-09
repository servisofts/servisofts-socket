import SSocket, { SSocketConfigProps } from "..";
import { SThread } from 'servisofts-component';
import SSClient from './SSClient/index';

var DEBUG = false;
export default class SSession {
    timePing = 10 * (1000); // time * (milliseconds)
    timeReconect = 4 * (1000); // time * (milliseconds)
    timeReintent = 10 * (1000); // time * (milliseconds)
    props;
    socket;
    ssocketInstance;
    identificado;
    iniciado;
    pendinPromises: any = {};

    constructor(props: SSocketConfigProps) {
        this.props = props;
        DEBUG = this.props.debug;
        if (this.props.timeReconnect) {
            this.timeReconect = this.props.timeReconnect;
        }
        if (this.props.timeReintent) {
            this.timeReintent = this.props.timeReintent;
        }
        // this.log("Instanciando el socket");
        // this.log("props", JSON.stringify(props, null, "\t"));
        this.socket = new SSClient(props, this);
    }
    isOpen() {
        if (!this.identificado) return false;
        return this.socket.isOpen();
    }
    init(instance) {
        // this.log("Init")
        this.ssocketInstance = instance;
        this.socket.open();
    }

    ping() {
        new SThread(this.timePing, "hiloSocket_ping_" + this.props.name, true).start(() => {
            if (!this.isOpen()) {
                return;
            }
            if (!this) return;
            if (!this.identificado) {
                if (!this.identificarse) return;
                this.identificarse();
            }
            this.socket.open();

            this.ping();
        })
    }
    reconect() {
        new SThread(this.timeReconect, "hiloSocket_reconect_" + this.props.name, false).start(() => {
            if (this.isOpen()) {
                return;
            }
            this.log("intentando reconectar..." + this.timeReconect);
            this.socket.open();
            // this.reconect();
        })
    }

    identificarse() {
        if (!this.ssocketInstance.props) return;
        if (!this.ssocketInstance.props.identificarse) return;
        var prIdent = this.ssocketInstance.props.identificarse({ state: this.ssocketInstance.getState() });
        var usr = false;
        var deviceKey = "deviceKey"
        var objSend = {
            component: "usuario",
            type: "identificacion",
            data: {},
            deviceKey: deviceKey,
            ...prIdent,
            estado: "cargando"
        };
        console.log("[ Servisofts ] [ SSocket ] : identificando")
        this.send(objSend);
    }
    indentificarse() {
        console.warn("[ Servisofts ] [ SSocket ] : Method indentificarse() is deprecated. Plase move to identificarse()")
        if (!this.ssocketInstance.props) return;
        if (!this.ssocketInstance.props.identificarse) return;
        var prIdent = this.ssocketInstance.props.identificarse({ state: this.ssocketInstance.getState() });
        var usr = false;
        var deviceKey = "deviceKey"
        var objSend = {
            component: "usuario",
            type: "identificacion",
            data: {},
            deviceKey: deviceKey,
            ...prIdent,
            estado: "cargando"
        };
        this.send(objSend);
    }

    reintent(obj) {
        if (typeof obj != 'object') {
            try {
                obj = JSON.parse(obj);
            } catch (e) {
                this.log("ERROR", "notifyRedux error al convertir el mensaje a JSON")
                return;
            }
        }
        new SThread(this.timeReintent, "hilo_reintent" + obj.component, true).start(() => {
            obj.estado = "";
            this.notifyRedux(obj);
            // if (obj["_ssocket_promise"]) {
            //     if (this.pendinPromises[obj["_ssocket_promise"]]) {
            //         obj.estado = "error";
            //         obj.error = "timeOut";
            //         this.pendinPromises[obj["_ssocket_promise"]].reject(obj);
            //         delete this.pendinPromises[obj["_ssocket_promise"]];
            //     }
            //     return;
            // }
        })
    }

    async send(msn, noRedux = false) {
        var str = msn;
        if (typeof msn == 'object') {
            str = JSON.stringify(msn);
        }
        if (!noRedux) {
            this.reintent(str)
        }
        if (!this.socket) {
            return;
        }
        if (!this.socket.send) return;
        new SThread(10, str, true).start(() => {
            this.log("[OUT]", msn?.component, msn?.type, msn?.estado, msn);
            this.socket.send(str);
            if (!noRedux) {
                this.notifyRedux(str);
            }
        })

    }
    async sendPromise(resolve, reject, obj, timeout, cant = 1, key = this.generateUUID()) {
        obj["_ssocket_promise"] = key;
        if (!this.iniciado) {
            new SThread(1000, "hilo_reintent" + obj["_ssocket_promise"], false).start(() => {
                if (cant > 10) {
                    obj.estado = "error";
                    obj.error = "noIniciado";
                    reject(obj);
                    return;
                }
                this.sendPromise(resolve, reject, obj, timeout, cant++, key);
                return;
            });
            return;
        }
        this.pendinPromises[obj["_ssocket_promise"]] = {
            resolve: resolve,
            reject: reject
        };
        this.send(obj, true);

        new SThread(timeout, "hilo_reintent_promise" + obj["_ssocket_promise"], true).start(() => {
            if (obj["_ssocket_promise"]) {
                if (this.pendinPromises[obj["_ssocket_promise"]]) {
                    obj.estado = "error";
                    obj.error = "timeOut";
                    this.pendinPromises[obj["_ssocket_promise"]].reject(obj);
                    delete this.pendinPromises[obj["_ssocket_promise"]];
                }
                return;
            }
        })
    }

    async sendPromise2(resolve, reject, obj, timeout, cant = 1, key = this.generateUUID()) {
        obj["_ssocket_promise"] = key;
        if (!this.iniciado) {
            obj.estado = "error";
            obj.error = "noIniciado";
            reject(obj);
            return;
        }
        this.pendinPromises[obj["_ssocket_promise"]] = {
            resolve: resolve,
            reject: reject
        };
        this.send(obj, true);

        new SThread(timeout, "hilo_reintent_promise" + obj["_ssocket_promise"], true).start(() => {
            if (obj["_ssocket_promise"]) {
                if (this.pendinPromises[obj["_ssocket_promise"]]) {
                    obj.estado = "error";
                    obj.error = "timeOut";
                    this.pendinPromises[obj["_ssocket_promise"]].reject(obj);
                    delete this.pendinPromises[obj["_ssocket_promise"]];
                }
                return;
            }
        })
    }


    onOpen() {
        this.ping();
        this.identificado = false;
        this.identificarse();
        // this.log("onOpen");
    }
    onClose(e) {
        console.log(e);
        this.log("onClose");
        this.reconect();
        this.identificado = false;
    }
    onError(evt) {
        this.log("onError", JSON.stringify(evt));
    }

    mensajeTemp = "";

    notifyRedux(obj) {
        if (typeof obj != 'object') {
            try {
                obj = JSON.parse(obj);
            } catch (e) {
                // console.log(e);
                this.log("ERROR", "notifyRedux error al convertir el mensaje a JSON")
                return;
            }
        }
        if (!this.ssocketInstance) {
            this.log("ERROR", "No hay ssocketInstance, No se pudo hacer dispatch del mensaje.")
            return;
        }
        try {
            // new SThread(20, "as", false).start(() => {
            this.ssocketInstance.dispatch(obj);
            // });
        } catch (e) {
            // console.log(e);
        }

        return;
    }
    onMessage(msn) {
        this.mensajeTemp += msn
        if (/---SSofts---/.test(msn)) {
            this.mensajeTemp = this.mensajeTemp.replace(/---SSofts---/, '');
            var arr = this.mensajeTemp.split("---SSkey---");
            this.mensajeTemp = ""; // reset cola;
            var mensaje = arr[0]; //data
            var key = arr[1]; // SSkey
            try {
                var obj = JSON.parse(mensaje);
                this.log("[IN]", obj?.component, obj?.type, obj?.estado, obj);
                if (obj["_ssocket_promise"]) {
                    console.log("Entro al socket promise");
                    if (this.pendinPromises[obj["_ssocket_promise"]]) {
                        if (obj.estado == "error") {
                            this.pendinPromises[obj["_ssocket_promise"]].reject(obj);
                        } else {
                            this.pendinPromises[obj["_ssocket_promise"]].resolve(obj);
                        }

                        delete this.pendinPromises[obj["_ssocket_promise"]];
                    }
                    return;
                }
                this.notifyRedux(obj);
                this.manejadorInterno(obj);
            } catch (e) {
                this.log("onMessage Error", e);
            }
        }
    }

    manejadorInterno(obj) {
        if (!obj.component) return;
        switch (obj.component) {
            case "servicio":
                switch (obj.type) {
                    case "init":
                        this.iniciado = true;
                }
            case "usuario":
                switch (obj.type) {
                    case "identificacion":
                        if (obj.estado == "exito") {
                            this.identificado = true;
                            this.notifyRedux({
                                component: "usuario",
                                type: "identificacion",
                                estado: "exito"
                            });
                            // this.log("identificado con exito");
                            return;
                        }
                    default: return;
                }
            default: return;
        }
    }


    getTitle(color, val) {
        return `\x1b[${color}m${val}\x1b[39m`;
    }
    log(...args) {
        if (!DEBUG) return;
        var other = args.slice(1);
        var type = args[0];
        type = this.getTitle(type == "[IN]" ? 32 : 33, type)
        console.log(this.getTitle(34, "[SS]") + type, ...other)
    }
    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}