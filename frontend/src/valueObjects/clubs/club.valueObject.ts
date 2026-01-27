export interface clubValueObjectProps {
    id: string;
    displayName: string;
    description: string;
    presidentId: string;
    thumbnail: string;
    pictures: string[];
    members: {role: string, id: string}[];
    nbFollowers: number;
}

export default class ClubValueObject {
    private id: string;
    private displayName: string;
    private description: string;
    private presidentId: string;
    private thumbnail: string;
    private pictures: string[];
    private members: {role: string; id: string}[];
    private nbFollowers: number;

    constructor(props: clubValueObjectProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.description = props.description;
        this.presidentId = props.presidentId;
        this.thumbnail = props.thumbnail;
        this.pictures = props.pictures;
        this.members = props.members;
        this.nbFollowers = props.nbFollowers;
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

    getNbFollowers() {
        return this.nbFollowers;
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
            nbFollowers: this.nbFollowers,
        };
    }
}
