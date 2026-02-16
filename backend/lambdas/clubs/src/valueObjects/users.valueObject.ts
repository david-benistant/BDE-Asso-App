export interface userValueObjectProps {
    id: string;
    name: string;
    displayName: string;
    email: string;
    followedClubs: string[];
    joinedClubs: string[];
}

class UserValueObject {
    private id: string;
    private name: string;
    private displayName: string;
    private email: string;
    private followedClubs: string[]
    private joinedClubs: string[]

    constructor(props: userValueObjectProps) {
        this.id = props.id;
        this.name = props.name;
        this.displayName = props.displayName;
        this.email = props.email;
        this.followedClubs = props.followedClubs;
        this.joinedClubs = props.joinedClubs;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDisplayName() {
        return this.displayName;
    }

    getEmail() {
        return this.email;
    }

    getFollowedClubs() {
        return this.followedClubs;
    }

    getJoinedClubs() {
        return this.joinedClubs;
    }

    getObject(): userValueObjectProps {
        return {
            email: this.email,
            name: this.name,
            displayName: this.displayName,
            id: this.id,
            followedClubs: this.followedClubs,
            joinedClubs: this.joinedClubs
        };
    }
}

export default UserValueObject;
