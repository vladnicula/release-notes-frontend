/**
 * Pretty message that helps us know when a env variable
 * is not availalbe and supposed to be as opposed to 
 * other code that is not in our app which randomly throws
 * not found errors
 */
export const readEnvOrThrow = (envKey: string): string => {
    const keyValue = process.env[envKey]
    if ( !keyValue ) {
        throw new Error(`[EnvSetupError]: Could not find ${envKey} in process.env.`)
    }

    return keyValue
}
