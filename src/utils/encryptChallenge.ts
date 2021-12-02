import { createMessage, encrypt, readKey } from "openpgp"

export async function encryptChallenge(challenge: string, publicKey: string) {
    const message = await createMessage({text: challenge})
    const barePublicKey = await readKey({ armoredKey: publicKey });
    const result = await encrypt({
        encryptionKeys: barePublicKey,
        message: message
    })
    return result
}