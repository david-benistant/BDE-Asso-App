export interface eventValueObjectProps {
    clubId: string;
    id: string;
    title: string;
    description: string;
    attachedObjects: string[];
    createdAt: number;
    date: number;
    expiresAt: number;
    visibility: Tvisibility;
    attendee: { displayName: string, id: string }[];
    duration: number;
    weekBucket: number;
}

export type Tvisibility = "public" | "private";

class EventValueObject {
    private clubId: string;
    private id: string;
    private title: string;
    private description: string;
    private attachedObjects: string[];
    private createdAt: Date;
    private date: Date;
    private expiresAt: Date;
    private visibility: Tvisibility;
    private attendee: { displayName: string, id: string }[];
    private duration: number;
    private weekBucket: number;

    constructor(props: Omit<eventValueObjectProps, "expiresAt" | "createdAt" >) {
        this.clubId = props.clubId;
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.attachedObjects = props.attachedObjects;
        this.createdAt =
            "createdAt" in props && typeof props.createdAt === "number"
                ? new Date(props.createdAt * 1000)
                : new Date();
        this.date = new Date(props.date * 1000);
        this.expiresAt =
            "expiresAt" in props && typeof props.expiresAt === "number"
                ? new Date(props.expiresAt * 1000)
                : new Date((props.date + 60 * 60 * 24 * 31) * 1000);

        this.duration = props.duration;
        this.visibility = props.visibility;
        this.attendee = props.attendee;
        this.weekBucket = props.weekBucket;
    }

    getId() {
        return this.id;
    }

    getClubId() {
        return this.clubId;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getAttachedObject() {
        return this.attachedObjects;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getDate() {
        return this.date;
    }

    getExpiresAt() {
        return this.expiresAt;
    }

    getVisibility() {
        return this.visibility;
    }

    getAttendee() {
        return this.attendee;
    }

    getDuration() {
        return this.duration;
    }

    getWeekBucket() {
        return this.weekBucket
    }

    getObject(): eventValueObjectProps {
        return {
            clubId: this.clubId,
            id: this.id,
            title: this.title,
            description: this.description,
            attachedObjects: this.attachedObjects,
            createdAt: Math.floor(this.createdAt.getTime() / 1000),
            date: Math.floor(this.date.getTime() / 1000),
            expiresAt: Math.floor(this.expiresAt.getTime() / 1000),
            visibility: this.visibility,
            attendee: this.attendee,
            duration: this.duration,
            weekBucket: this.weekBucket
        };
    }
}

export default EventValueObject;
