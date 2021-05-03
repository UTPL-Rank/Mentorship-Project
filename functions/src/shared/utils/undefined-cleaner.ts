/**
 * Removes every property in an object that contains an undefined value.
 * @param obj Object that needs to be cleaned
 */
export function UndefinedCleaner<T extends { [key: string]: any }>(obj: T): Exclude<T, undefined> {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object')
            UndefinedCleaner(obj[key])
        else if (obj[key] === null)
            delete obj[key]
    });

    return obj as Exclude<T, undefined>;
}