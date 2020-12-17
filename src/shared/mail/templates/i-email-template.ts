export interface IEmailTemplate<T> {

    /**
     * Data expected to be used when generating  
     */
    data: T | null;

    /**
     * Generator function create the html text required for an email
     */
    html(): string;
}