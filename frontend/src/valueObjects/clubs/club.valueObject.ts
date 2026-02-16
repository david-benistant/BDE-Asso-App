
export const Roles = {
    PRESIDENT: "p",
    ORGANISATOR: "o",
    MEMBER: "m"
} as const;
export interface clubValueObjectProps {
    id: string;
    displayName: string;
    description: string;
    presidentId: string;
    thumbnail: string;
    pictures: string[];
    members: { role: string; id: string; displayName: string; }[];
    followers: string[];
}

export default class ClubValueObject {
    private id: string;
    private displayName: string;
    private description: string;
    private presidentId: string;
    private thumbnail: string;
    private pictures: string[];
    private members: { role: string; id: string; displayName: string; }[];
    private followers: string[];

    constructor(props: clubValueObjectProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.description = props.description;
        this.presidentId = props.presidentId;
        this.thumbnail = props.thumbnail;
        this.pictures = props.pictures;
        this.members = props.members;
        this.followers = props.followers;
    }

    getId() {
        return this.id;
    }

    getDisplayName() {
        return this.displayName;
    }

    getDescription() {
        return this.description;
    }

    getPresidentId() {
        return this.presidentId;
    }

    getThumbnail() {
        return this.thumbnail;
    }

    getPictures() {
        return this.pictures;
    }

    getMembers() {
        return this.members;
    }

    getfollowers() {
        return this.followers;
    }

    getObject(): clubValueObjectProps {
        return {
            id: this.id,
            displayName: this.displayName,
            description: this.description,
            presidentId: this.presidentId,
            thumbnail: this.thumbnail,
            pictures: this.pictures,
            members: this.members,
            followers: this.followers,
        };
    }
}
