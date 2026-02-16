import properties from "../../../../properties.json";

class PropertiesService {
    private STAGE: string;
    private AZURE_CLIENT_ID: string;
    private CLUBS_TABLE: string;
    private PROFILES_BUCKET: string;
    private PICTURES_BUCKET: string;
    private USERS_TABLE: string;
    private JOIN_REQUEST_TABLE: string;
    private NOTIFICATIONS_TABLE: string;
    private EVENTS_TABLE: string;
    private ATTACHMENTS_BUCKET: string;

    constructor() {
        this.STAGE = properties.STAGE;
        this.CLUBS_TABLE = `${properties.CLUBS_TABLE}-${this.STAGE}`;
        this.AZURE_CLIENT_ID = properties.AZURE_CLIENT_ID;
        this.PROFILES_BUCKET = `${properties.PROFILES_BUCKET}-${this.STAGE}`;
        this.PICTURES_BUCKET = `${properties.PICTURES_BUCKET}-${this.STAGE}`;
        this.USERS_TABLE = `${properties.USERS_TABLE}-${this.STAGE}`;
        this.JOIN_REQUEST_TABLE = `${properties.JOIN_REQUEST_TABLE}-${this.STAGE}`;
        this.NOTIFICATIONS_TABLE = `${properties.NOTIFICATIONS_TABLE}-${this.STAGE}`;
        this.EVENTS_TABLE = `${properties.EVENTS_TABLE}-${this.STAGE}`;
        this.ATTACHMENTS_BUCKET = `${properties.ATTACHMENTS_BUCKET}-${this.STAGE}`;
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

    getAttachmentsBucket() {
        return this.ATTACHMENTS_BUCKET;
    }

    getPicturesBucket() {
        return this.PICTURES_BUCKET;
    }

    getUserTable() {
        return this.USERS_TABLE;
    }

    getJoinRequestTable() {
        return this.JOIN_REQUEST_TABLE;
    }

    getEventsTable() {
        return this.EVENTS_TABLE
    }

    getNotificationTable() {
        return this.NOTIFICATIONS_TABLE;
    }
}

export default new PropertiesService();
