

class picturesCDN {
    private endpoint = "https://d3af1mpu4ymeb1.cloudfront.net"

    get(path: string) {
        return `${this.endpoint}/${path}`
    }
}

export default new picturesCDN;