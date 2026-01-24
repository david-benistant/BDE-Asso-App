

class photoCDN {
    private endpoint = "https://d1jez59y6icro.cloudfront.net"

    get(userId: string) {
        return `${this.endpoint}/${userId}`
    }
}

export default new photoCDN;