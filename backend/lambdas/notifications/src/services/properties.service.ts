import properties from "../../../../properties.json"

class PropertiesService {
    private STAGE: string;
    private AZURE_CLIENT_ID: string;
    private USERS_TABLE: string;
    private PROFILES_BUCKET: string;
    private NOTIFICATIONS_TABLE: string;

    constructor() {
        this.STAGE = properties.STAGE;
        this.USERS_TABLE = `${properties.USERS_TABLE}-${this.STAGE}`;
        this.AZURE_CLIENT_ID = properties.AZURE_CLIENT_ID;
        this.PROFILES_BUCKET = `${properties.PROFILES_BUCKET}-${this.STAGE}`;
        this.NOTIFICATIONS_TABLE = `${properties.NOTIFICATIONS_TABLE}-${this.STAGE}`;
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

    getProfileBucket() {
        return this.PROFILES_BUCKET;
    }

    getNotificationTable() {
        return this.NOTIFICATIONS_TABLE;
    }
}

export default new PropertiesService();
