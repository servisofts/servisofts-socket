import React, { Component } from 'react'
import { SThread } from 'servisofts-component';
import { connect } from 'react-redux';
// const URL = "http://192.168.0.3:8080/"
var INSTANCE = null;
class SHttp extends Component {
    static reintent(obj, props) {
        if (typeof obj != 'object') {
            try {
                obj = JSON.parse(obj);
            } catch (e) {
                // this.log("ERROR", "notifyRedux error al convertir el mensaje a JSON")
                return;
            }
        }
        new SThread(5000, "hilo_reintent" + obj.component, true).start(() => {
            obj.estado = "";
            props.dispatch(obj);
            // this.notifyRedux(obj);
        })
    }
    static send(url, data, files, props) {
        if (!props) return;
        props.dispatch(data);
        var formdata = new FormData();
        formdata.append("data", JSON.stringify(data));
        if (files) {
            for (var i = 0; i < files.length; i++) {
                formdata.append("file" + i, files[i]);
            }
        }
        var requestOptions: any = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
        };
        SHttp.reintent(data, props);
        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                props.dispatch(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    }
    static post(url, data, props) {
        if (!props) return;
        props.dispatch(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions: any = {
            method: 'POST',
            // headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow',
        };
        SHttp.reintent(data, props);
        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                props.dispatch(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    }
    static getState() {
        return INSTANCE.state;
    }
    // static dispatch(data) {
    //     // console.log("dispatch", data);
    //     return INSTANCE.dispatch(data);
    // }
    constructor(props) {
        super(props);
        INSTANCE = props;
        this.state = {
        }
    }
    render() {
        INSTANCE = this.props;
        return (
            this.props.children
        )
    }
}

const initStates = (state) => {
    return { state }
};
export default connect(initStates)(SHttp);