

class profileCDN {
    private endpoint = "https://d149itoigrs52f.cloudfront.net"

    get(userId: string) {
        return `${this.endpoint}/${userId}`
    }
}

export default new profileCDN;