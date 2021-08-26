export interface IChallenge {
    generateChallenge: () => string,
    encryptChallenge: (challenge: string) => string,
    verifyChallengeResponse: (response: string) => boolean 
}