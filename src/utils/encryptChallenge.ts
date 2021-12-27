import { createMessage, encrypt, readKey } from "openpgp"

export async function encryptChallenge(challenge: string, publicKey: string) {
    console.log("publicKey for encrypt challenge", publicKey)
    const message = await createMessage({text: challenge})
    const barePublicKey = await readKey({ armoredKey: publicKey });
    const result = await encrypt({
        encryptionKeys: barePublicKey,
        message: message
    })
    return result
}