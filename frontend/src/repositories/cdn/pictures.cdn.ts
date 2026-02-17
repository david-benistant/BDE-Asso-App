

class picturesCDN {
    private endpoint = "https://dyvlfli0anz5v.cloudfront.net"

    get(hash: string) {
        return `${this.endpoint}/${hash}`
    }
}

export default new picturesCDN;