export declare type SSocketConfigProps = {
    name: string;
    host: 'localhost' | string;
    port: {
        native: number;
        web: number;
        http: number;
    };
    ssl: boolean;
    cert: string;
};
declare const _default: any;
export default _default;
