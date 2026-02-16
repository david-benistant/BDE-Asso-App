export enum NotificationType {
    EVENT = "event",
    JOIN_REQUEST = "join-request",
    INFO = "info",

}

export interface notificationValueObjectProps {
    userId: string;
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    resourceId: string;
    expiresAt: number;
    createdAt: number; 
}


class NotificationValueObject {
    private userId: string;
    private id: string;
    private title: string;
    private message: string;
    private type: NotificationType;
    private resourceId: string;
    private expiresAt: number;
    private createdAt: number; 


    constructor(props: notificationValueObjectProps) {
        this.userId = props.userId;
        this.id = props.id;
        this.title = props.title;
        this.message = props.message;
        this.type = props.type;
        this.resourceId = props.resourceId;
        this.expiresAt = props.expiresAt;
        this.createdAt = props.createdAt;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getTitle(): string {
        return this.title;
    }

    public getMessage(): string {
        return this.message;
    }

    public getType(): NotificationType {
        return this.type;
    }

    public getResourceId(): string {
        return this.resourceId;
    }

    public getExpiresAt(): number {
        return this.expiresAt;
    }

    public getId(): string {
        return this.id;
    }

    public getCreatedAt(): number {
        return this.createdAt;
    }

    public getObject(): notificationValueObjectProps {
        return {
            userId: this.userId,
            id: this.id,
            title: this.title,
            message: this.message,
            type: this.type,
            resourceId: this.resourceId,
            expiresAt: this.expiresAt,
            createdAt: this.createdAt
        };
    }
}

export default NotificationValueObject;
