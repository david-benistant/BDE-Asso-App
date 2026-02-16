export enum Roles {
    PRESIDENT = "p",
    ORGANISATOR = "o",
    MEMBER = "m"
}

export interface clubValueObjectProps {
    id: string;
    displayName: string;
    name: string;
    description: string;
    presidentId: string;
    thumbnail: string;
    pictures: string[];
    members:  { role: Roles; id: string; displayName: string; }[];
    followers: string[];
}

class ClubValueObject {
    private id: string;
    private displayName: string;
    private name: string;
    private description: string;
    private presidentId: string;
    private thumbnail: string;
    private pictures: string[];
    private members:  { role: Roles; id: string; displayName: string; }[];
    private followers: string[];

    constructor(props: clubValueObjectProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.name = props.name;
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

    getName() {
        return this.name;
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
            name: this.name,
            description: this.description,
            presidentId: this.presidentId,
            thumbnail: this.thumbnail,
            pictures: this.pictures,
            members: this.members,
            followers: this.followers,
        };
    }
}

export default ClubValueObject;
