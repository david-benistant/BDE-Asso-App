import { profileCDNEndpoint } from "@src/endpointsConfig";


class profileCDN {
    private endpoint = profileCDNEndpoint

    get(userId: string) {
        return `${this.endpoint}/${userId}`
    }
}

export default new profileCDN;