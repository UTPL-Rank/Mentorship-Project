/**
 * valid string identifiers
 */
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a random string with an specific length
 * @param length size of the identifier, default value is 12
 * @returns identifier in string format
 */
export function GenerateId(length = 12): string {
    const result = [];
    const charactersLength = CHARACTERS.length;

    for (let i = 0; i < length; i++)
        result.push(CHARACTERS.charAt(Math.floor(Math.random() * charactersLength)));

    return result.join('');
}
