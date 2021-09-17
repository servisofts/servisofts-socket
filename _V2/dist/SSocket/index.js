var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from 'react';
import { SText, SView, SScrollView2 } from 'servisofts-component';
import { defaultConfig } from './default.config';
import SSession from './SSession/index';
import { connect } from 'react-redux';
var SSocket = /** @class */ (function (_super) {
    __extends(SSocket, _super);
    function SSocket(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            log: []
        };
        return _this;
    }
    SSocket.register = function (observado, callback) {
        SSocket.Observados[observado] = callback;
    };
    SSocket.getSession = function () {
        if (!SSocket.Instance) {
            SSocket.Instance = new SSession(defaultConfig);
        }
        return SSocket.Instance;
    };
    SSocket.send = function (data) {
        //TODO: send data to server
        if (!SSocket.getSession()) {
            return;
        }
        SSocket.getSession().send(data);
    };
    SSocket.prototype.componentDidMount = function () {
        this.initApi();
        SSocket.getSession().init(this);
    };
    SSocket.prototype.initApi = function () {
        if (defaultConfig.ssl) {
            SSocket.api.root = "https://" + defaultConfig.host + "/images/";
            SSocket.api.img = "https://" + defaultConfig.host + "/img/";
            SSocket.api.manejador = "https://" + defaultConfig.host + "/manejador/";
        }
        else {
            SSocket.api.root = "http://" + defaultConfig.host + ":" + defaultConfig.port.http + "/";
            SSocket.api.img = "http://" + defaultConfig.host + ":" + defaultConfig.port.http + "/img/";
            SSocket.api.manejador = "http://" + defaultConfig.host + ":" + defaultConfig.port.http + "/manejador/";
        }
    };
    SSocket.prototype.getLogs = function () {
        return this.state.log.map(function (item, index) {
            return React.createElement(SText, { fontSize: 12 },
                "\n",
                item);
        });
    };
    SSocket.prototype.notifyObserver = function () {
        var _this = this;
        Object.keys(SSocket.Observados).forEach(function (key) {
            SSocket.Observados[key](_this);
        });
    };
    SSocket.prototype.render = function () {
        this.notifyObserver();
        // return <></>
        // if (SSocket.getSession().isOpen()) {
        //     return null;
        // }
        return (React.createElement(SView, { style: {
                width: 400,
                height: "100%",
                position: "absolute",
                backgroundColor: "#66666699",
                borderRadius: 10,
                overflow: "hidden"
            }, center: true },
            React.createElement(SText, { fontSize: 16 }, "SSocket"),
            React.createElement(SScrollView2, { disableHorizontal: true },
                React.createElement(SView, { flex: true, col: "xs-12" }, this.getLogs()))));
    };
    SSocket.Observados = {};
    SSocket.api = {
        root: "",
        manejador: "",
        img: ""
    };
    SSocket.Instance = null;
    return SSocket;
}(Component));
var initStates = function (state) {
    return { state: state };
};
export default connect(initStates)(SSocket);
