

class picturesCDN {
    private endpoint = "https://d3sn3z46i3e7c9.cloudfront.net"

    get(hash: string) {
        return `${this.endpoint}/${hash}`
    }
}

export default new picturesCDN;