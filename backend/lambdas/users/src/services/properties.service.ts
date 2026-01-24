import properties from "../../../../properties.json";

class PropertiesService {
    private STAGE: string;
    private AZURE_CLIENT_ID: string;
    private USERS_TABLE: string;
    private PHOTOS_BUCKET: string;

    constructor() {
        this.STAGE = properties.STAGE;
        this.USERS_TABLE = `${properties.USERS_TABLE}-${this.STAGE}`;
        this.AZURE_CLIENT_ID = properties.AZURE_CLIENT_ID;
        this.PHOTOS_BUCKET = `${properties.PHOTOS_BUCKET}-${this.STAGE}`;
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

    getPhotoBucket() {
        return this.PHOTOS_BUCKET;
    }
}

export default new PropertiesService();
