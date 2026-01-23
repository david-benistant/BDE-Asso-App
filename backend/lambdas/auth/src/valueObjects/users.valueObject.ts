
export interface userValueObjectProps {
    id: string;
    displayName: string;
    email: string;
}


class UserValueObject {

    private id: string;
    private displayName: string;
    private email: string;

    constructor(props: userValueObjectProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.email = props.email;
    }

    getId() {
        return this.id;
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
            displayName: this.displayName,
            id: this.id
        }
    }
}

export default UserValueObject;