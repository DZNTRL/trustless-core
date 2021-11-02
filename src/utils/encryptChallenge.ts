import { createMessage, encrypt, readKey } from "openpgp"

export async function encryptChallenge(challenge: string, publicKey: string) {
    console.log("encrypt challenge")
    const message = await createMessage({text: challenge})
    const barePublicKey = await readKey({ armoredKey: publicKey });
    console.log("barePublicKey", barePublicKey)
    console.log("Message", message)
    const result = await encrypt({
        encryptionKeys: barePublicKey,
        message: message
    })
    return result
}