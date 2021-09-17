import { NativeEventEmitter, NativeModules } from 'react-native';
var Sockets = NativeModules.TcpSockets;
var instanceNumber = 0;
function getNextId() {
    return instanceNumber++;
}
var nativeEventEmitter = new NativeEventEmitter(Sockets);
export { nativeEventEmitter, getNextId };
