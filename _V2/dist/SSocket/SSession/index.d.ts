import { SSocketConfigProps } from "..";
export default class SSession {
    timePing: number;
    timeReconect: number;
    timeReintent: number;
    props: any;
    socket: any;
    ssocketInstance: any;
    identificado: any;
    identificarse: any;
    constructor(props: SSocketConfigProps);
    isOpen(): any;
    init(instance: any): void;
    ping(): void;
    reconect(): void;
    indentificarse(): void;
    reintent(obj: any): void;
    send(msn: any): void;
    onOpen(): void;
    onClose(): void;
    onError(evt: any): void;
    mensajeTemp: string;
    notifyRedux(obj: any): void;
    onMessage(msn: any): void;
    manejadorInterno(obj: any): void;
    log(...args: any[]): void;
}