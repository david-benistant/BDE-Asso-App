import { v4 } from "uuid";
import messages from "../../../../notifications-messages.json";
import ApiError, { ApiErrorStatus } from "@services/errors.service";
import UserValueObject from "./users.valueObject";

export enum NotificationType {
    EVENT = "event",
    JOIN_REQUEST = "join-request",
    INFO = "info",

}

export interface notificationValueObjectProps {
    userId: string;
    userEmail: string;
    userDisplayName: string;
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    resourceId: string;
    expiresAt: number;
    createdAt: number; 
}

interface NotificationMessage {
    title: string;
    message: string;
    type: NotificationType;
}

class NotificationValueObject {
    private userId: string;
    private userEmail: string;
    private userDisplayName: string;
    private id: string;
    private title: string;
    private message: string;
    private type: NotificationType;
    private resourceId: string;
    private expiresAt: number;
    private createdAt: number; 

    static create(
        key: string,
        attributes: Record<string, string>,
        user: UserValueObject | { getDisplayName: () => string, getEmail: () => string, getId: () => string },
        resourceId: string,
    ) {
        const value: NotificationMessage = messages[key];
        if (!value) {
            throw new ApiError(
                500,
                ApiErrorStatus.INTERNAL_SERVER_ERROR,
                "Notification message not found",
            );
        }
        let tmpTitle = value.title;
        let tmpMessage = value.message;

        for (const [key, value] of Object.entries(attributes)) {
            tmpTitle = tmpTitle.replace(key, value);
            tmpMessage = tmpMessage.replace(key, value);
        }

        return new NotificationValueObject({
            userDisplayName: user.getDisplayName(),
            userEmail: user.getEmail(),
            userId: user.getId(),
            id: v4(),
            resourceId,
            title: tmpTitle,
            message: tmpMessage,
            type: value.type,
            expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 31,   // 1 month
            createdAt: Math.floor(Date.now() / 1000),
        });
    }

    constructor(props: notificationValueObjectProps) {
        this.userDisplayName = props.userDisplayName;
        this.userEmail = props.userEmail;
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

    public getUserEmail(): string {
        return this.userEmail;
    }

    public getUserDisplayName(): string {
        return this.userDisplayName;
    }

    public getObject(): notificationValueObjectProps {
        return {
            userId: this.userId,
            userDisplayName: this.userDisplayName,
            userEmail: this.userEmail,
            id: this.id,
            title: this.title,
            message: this.message,
            type: this.type,
            resourceId: this.resourceId,
            expiresAt: this.expiresAt,
            createdAt: this.createdAt,
        };
    }
}

export default NotificationValueObject;
