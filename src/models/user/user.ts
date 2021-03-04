export namespace SGMUser {
    interface _Base {
        username?: string;
        disabled: boolean;
        displayName: string;
        email: string;
        photoURL: string | null;
        uid: string;
    }

    /**
     * Get the information of any user in the platform
     */
    export interface readDto extends _Base { }

    export module functions {
        export interface createDto extends _Base {
            username: string;
            disabled: false;
        }
    }
}