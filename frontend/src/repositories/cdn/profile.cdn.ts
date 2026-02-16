

class profileCDN {
    private endpoint = "https://d15lraf9xbx4py.cloudfront.net"

    get(userId: string) {
        return `${this.endpoint}/${userId}`
    }
}

export default new profileCDN;