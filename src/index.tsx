import SSocket from "./SSocket";
import { SSocketConfigProps } from "./SSocket";
export type SSocketProps = SSocketConfigProps;

var DefautlConfig = null;
export function getDefaultConfig(): SSocketConfigProps {
    return DefautlConfig;
}
export const setProps = (props: SSocketProps) => {
    DefautlConfig = props;
    SSocket.initApi();
}
export default SSocket;