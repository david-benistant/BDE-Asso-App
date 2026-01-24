import properties from "../../../../properties.json";

class PropertiesService {
    private STAGE: string;
    private AZURE_CLIENT_ID: string;
    private CLUBS_TABLE: string;
    private PHOTOS_BUCKET: string;

    constructor() {
        this.STAGE = properties.STAGE;
        this.CLUBS_TABLE = `${properties.CLUBS_TABLE}-${this.STAGE}`;
        this.AZURE_CLIENT_ID = properties.AZURE_CLIENT_ID;
        this.PHOTOS_BUCKET = `${properties.PHOTOS_BUCKET}-${this.STAGE}`;
    }

    getStage() {
        return this.STAGE;
    }

    getAzureClientId() {
        return this.AZURE_CLIENT_ID;
    }

    getClubsTable() {
        return this.CLUBS_TABLE;
    }

    getPhotoBucket() {
        return this.PHOTOS_BUCKET;
    }
}

export default new PropertiesService();
