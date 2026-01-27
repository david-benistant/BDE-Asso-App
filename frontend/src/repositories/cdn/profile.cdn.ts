

class profileCDN {
    private endpoint = "https://dnm2c9ie7nmkw.cloudfront.net"

    get(userId: string) {
        return `${this.endpoint}/${userId}`
    }
}

export default new profileCDN;