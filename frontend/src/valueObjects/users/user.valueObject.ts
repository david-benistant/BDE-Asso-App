
export interface userValueObjectProps {
    displayName: string;
    email: string;
    id: string;

}

export default class UserValueObject {
    private displayName: string;
    private email: string;
    private id: string;

    constructor(props: userValueObjectProps) {
        this.displayName = props.displayName;
        this.email = props.email;
        this.id = props.id;
    }

    getDisplayName() {
        return this.displayName;
    }

    getEmail() {
        return this.email;
    }

    getId() {
        return this.id;
    }

    getObject(): userValueObjectProps {
        return {
            displayName: this.displayName,
            email: this.email,
            id: this.id
        }
    }
}