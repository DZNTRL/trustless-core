export interface IServiceUtils {
    generateChallenge: () => string
    encrypt: (decoded: string) => string
    decrypt: (encoded: string) => string
}