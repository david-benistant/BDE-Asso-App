export interface meInfosValueObjectProps {
    displayName: string;
    givenName: string;
    jobTitle: string;
    mail: string;
    mobilePhone: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
    id: string;
}

export default class MeInfosValueObject {
    private displayName: string;
    private givenName: string;
    private jobTitle: string;
    private mail: string;
    private mobilePhone: string;
    private officeLocation: string;
    private preferredLanguage: string;
    private surname: string;
    private userPrincipalName: string;
    private id: string;

    constructor(props: meInfosValueObjectProps) {
        this.displayName = props.displayName;
        this.givenName = props.givenName;
        this.jobTitle = props.jobTitle;
        this.mail = props.mail;
        this.mobilePhone = props.mobilePhone;
        this.officeLocation = props.officeLocation;
        this.preferredLanguage = props.preferredLanguage;
        this.surname = props.surname;
        this.userPrincipalName = props.userPrincipalName;
        this.id = props.id;
    }

    getDisplayName(): string {
        return this.displayName;
    }

    getGivenName(): string {
        return this.givenName;
    }

    getJobTitle(): string {
        return this.jobTitle;
    }

    getMail(): string {
        return this.mail;
    }

    getMobilePhone(): string {
        return this.mobilePhone;
    }

    getOfficeLocation(): string {
        return this.officeLocation;
    }

    getPreferredLanguage(): string {
        return this.preferredLanguage;
    }

    getSurname(): string {
        return this.surname;
    }

    getUserPrincipalName(): string {
        return this.userPrincipalName;
    }

    getId(): string {
        return this.id;
    }
}
