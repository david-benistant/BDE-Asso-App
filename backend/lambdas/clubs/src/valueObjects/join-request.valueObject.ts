export interface joinRequestValueObjectProps {
    userId: string;
    clubId: string;
    message: string;
    displayName: string;
}

class JoinRequestValueObject {
    private userId: string;
    private clubId: string;
    private message: string;
    private displayName: string;

    constructor(props: joinRequestValueObjectProps) {
        this.userId = props.userId;
        this.clubId = props.clubId;
        this.message = props.message;
        this.displayName = props.displayName;
    }

    getUserId() {
        return this.userId;
    }

    getClubId() {
        return this.clubId;
    }

    getMessage() {
        return this.message;
    }

    getDisplayName() {
        return this.displayName
    }

    getObject(): joinRequestValueObjectProps {
        return {
            userId: this.userId,
            clubId: this.clubId,
            message: this.message,
            displayName: this.displayName
        };
    }
}

export default JoinRequestValueObject;
