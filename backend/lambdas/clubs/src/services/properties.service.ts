import properties from "../../../../properties.json"

class PropertiesService {
    private STAGE: string;
    private AZURE_CLIENT_ID: string;
    private CLUBS_TABLE: string;
    private PROFILES_BUCKET: string;
    private PICTURES_BUCKET: string;

    constructor() {
        this.STAGE = properties.STAGE;
        this.CLUBS_TABLE = `${properties.CLUBS_TABLE}-${this.STAGE}`;
        this.AZURE_CLIENT_ID = properties.AZURE_CLIENT_ID;
        this.PROFILES_BUCKET = `${properties.PROFILES_BUCKET}-${this.STAGE}`;
        this.PICTURES_BUCKET = `${properties.PICTURES_BUCKET}-${this.STAGE}`;
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

    getProfileBucket() {
        return this.PROFILES_BUCKET;
    }

    getPicturesBucket() {
        return this.PICTURES_BUCKET;
    }


}

export default new PropertiesService();
