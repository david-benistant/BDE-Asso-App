import properties from '../../../../properties.json'

class PropertiesService {
    private STAGE: string;
    private AZURE_CLIENT_ID: string;
    private USERS_TABLE: string;

    constructor() {
        this.STAGE = properties.STAGE;
        this.USERS_TABLE = `${properties.USERS_TABLE}-${this.STAGE}`;
        this.AZURE_CLIENT_ID = properties.AZURE_CLIENT_ID
    }

    getStage() {
        return this.STAGE;
    }

    getAzureClientId() {
        return this.AZURE_CLIENT_ID;
    }

    getUserTable() {
        return this.USERS_TABLE;
    }
}

export default new PropertiesService