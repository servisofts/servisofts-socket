import React, { Component } from 'react';
import { SText, SView, STheme, SScrollView2 } from 'servisofts-component';
import { getDefaultConfig } from '../index';
import SSession from './SSession/index';
import { connect } from 'react-redux';

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
}

// type SocketConfProps = {
//     config: SSocketConfigProps
// }
class SSocket extends Component {
    static defaultConfig = getDefaultConfig();
    static Observados = {};

    static api = {
        root: "",
        manejador: "",
        img: "",
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
    static send(data) {
        //TODO: send data to server
        if (!SSocket.getSession()) {
            return;
        }
        SSocket.getSession().send(data);
    }
    state;
    constructor(props) {
        super(props);
        this.state = {
            log: []
        };
        // var data = require("../../../index.js");
        // alert(JSON.stringify(data));
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
    }

    getLogs() {
        return this.state.log.map((item, index) => {
            return <SText fontSize={12} >{"\n"}{item}</SText>
        })
    }
    notifyObserver() {
        Object.keys(SSocket.Observados).forEach((key) => {
            SSocket.Observados[key](this);
        });
    }
    render() {
        this.notifyObserver();
        return <></>
        // if (SSocket.getSession().isOpen()) {
        //     return null;
        // }
        return (
            <SView style={{
                width: 400,
                height: "100%",
                position: "absolute",
                backgroundColor: "#66666699",
                borderRadius: 10,
                overflow: "hidden",
            }} center>
                <SText fontSize={16} >SSocket</SText>
                <SScrollView2 disableHorizontal>
                    <SView flex col={"xs-12"} >
                        {this.getLogs()}
                    </SView>
                </SScrollView2>

            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(SSocket);