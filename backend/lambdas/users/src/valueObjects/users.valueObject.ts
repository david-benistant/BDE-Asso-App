export interface userValueObjectProps {
    id: string;
    name: string;
    displayName: string;
    email: string;
}

class UserValueObject {
    private id: string;
    private name: string;
    private displayName: string;
    private email: string;

    constructor(props: userValueObjectProps) {
        this.id = props.id;
        this.name = props.name;
        this.displayName = props.displayName;
        this.email = props.email;
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

    getObject(): userValueObjectProps {
        return {
            email: this.email,
            name: this.name,
            displayName: this.displayName,
            id: this.id,
        };
    }
}

export default UserValueObject;
