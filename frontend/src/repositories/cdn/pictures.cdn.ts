

class picturesCDN {
    private endpoint = "https://d2vcnzzog3cftm.cloudfront.net"

    get(hash: string) {
        return `${this.endpoint}/${hash}`
    }
}

export default new picturesCDN;