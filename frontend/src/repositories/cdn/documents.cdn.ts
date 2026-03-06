import { documentsCDNEndpoint } from "@src/endpointsConfig";


class documentsCDN {
    private endpoint = documentsCDNEndpoint

    get(path: string) {
        return `${this.endpoint}/${path}`
    }
}

export default new documentsCDN;