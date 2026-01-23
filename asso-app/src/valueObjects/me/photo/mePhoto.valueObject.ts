export interface mePhotoValueObjectProps {
    url: string;
}

export default class mePhotoValueObject {
    private url: string;

    constructor(props: mePhotoValueObjectProps) {
        this.url = props.url;
    }

    getUrl(): string {
        return this.url;
    }
}