import React, { Component } from 'react';
import { SText, SView, STheme, SScrollView2, SThread, SIcon } from 'servisofts-component';
import { getDefaultConfig } from '../index';
import SSession from './SSession/index';
import { connect } from 'react-redux';
import SHttp from './SHttp';
export type SSocketConfigProps = {
    name: string,
    host: 'localhost' | string,
    port: {
        native: number,// native ssl 'always' active
        web: number,// when ssl is enabled, final url will be wss://host/ws/
        http: number// when ssl is enabled final url will be https://host/api/
    },
    ssl: boolean,// Only for https ans wss connections
    cert: string,
    apis?: any,
}

// type SocketConfProps = {
//     config: SSocketConfigProps
// }
var _PROPS = null;
type SSocketData = {
    identificarse: (props) => void,
}
class SSocket extends Component<SSocketData> {
    static defaultConfig = getDefaultConfig();
    static Observados = {};

    static api = {
        root: "",
        manejador: "",
        img: "",
        rp: "",
    }

    static register(observado, callback) {
        SSocket.Observados[observado] = callback;
    }
    static Instance: SSession = null;
    static getSession() {
        if (!SSocket.defaultConfig) return null;
        if (!SSocket.Instance) {
            SSocket.Instance = new SSession(SSocket.defaultConfig);
        }
        return SSocket.Instance;
    }
    static sendHttp(url, data) {
        return SHttp.post(url, data, _PROPS);
    }
    static send(data) {
        //TODO: send data to server
        if (!SSocket.getSession()) {
            // alert(data.component)
            return;
        }
        if (!SSocket.getSession().isOpen()) {
            new SThread(100, "", true).start(() => {
                this.send(data);
            })
            return;
        }

        return SSocket.getSession().send(data);
    }
    state;
    constructor(props) {
        super(props);
        this.state = {
            log: []
        };
        this.initApi();
        // var data = require("../../../index.js");
        // alert(JSON.stringify(data));
        _PROPS = props;
    }
    componentDidMount() {
        this.initApi();
        SSocket.getSession().init(this);
    }
    initApi() {
        if (!SSocket.defaultConfig) SSocket.defaultConfig = getDefaultConfig();
        if (SSocket.defaultConfig.ssl) {
            SSocket.api.root = `https://${SSocket.defaultConfig.host}/images/`;
            SSocket.api.img = `https://${SSocket.defaultConfig.host}/img/`;
            SSocket.api.manejador = `https://${SSocket.defaultConfig.host}/manejador/`;
        } else {
            SSocket.api.root = `http://${SSocket.defaultConfig.host}:${SSocket.defaultConfig.port.http}/`;
            SSocket.api.img = `http://${SSocket.defaultConfig.host}:${SSocket.defaultConfig.port.http}/img/`;
            SSocket.api.manejador = `http://${SSocket.defaultConfig.host}:${SSocket.defaultConfig.port.http}/manejador/`;
        }
        Object.keys(SSocket.defaultConfig.apis).map((key) => {
            SSocket.api[key] = SSocket.defaultConfig.apis[key];
        })
    }

    // getLogs() {
    //     return this.state.log.map((item, index) => {
    //         return <SText fontSize={12} >{"\n"}{item}</SText>
    //     })
    // }
    notifyObserver() {
        Object.keys(SSocket.Observados).forEach((key) => {
            SSocket.Observados[key](this);
        });
    }
    render() {
        this.notifyObserver();
        _PROPS = this.props;
        // return <></>
        if (SSocket.getSession().isOpen()) {
            return null;
        }
        return <></>
        return (
            <SView style={{
                width: 200,
                height: 200,
                position: "absolute",
                backgroundColor: STheme.color.background + "aa",
                overflow: "hidden",
            }} center>
                <SView col={"xs-3 md-2 xl-1"}>
                    <SIcon name={"Wifi"} fill={STheme.color.secondary} />
                </SView>
                <SText>Conexion perdida</SText>
            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(SSocket);