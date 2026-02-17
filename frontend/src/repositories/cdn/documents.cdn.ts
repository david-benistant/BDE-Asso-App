

class picturesCDN {
    private endpoint = "https://d1fjeonelx84mf.cloudfront.net"

    get(path: string) {
        return `${this.endpoint}/${path}`
    }
}

export default new picturesCDN;