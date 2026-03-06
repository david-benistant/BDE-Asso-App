import { picturesCDNEndpoint } from "@src/endpointsConfig";


class picturesCDN {
    private endpoint = picturesCDNEndpoint

    get(hash: string) {
        return `${this.endpoint}/${hash}`
    }
}

export default new picturesCDN;