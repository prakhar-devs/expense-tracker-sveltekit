/**
 * This module provides a client-side only WebAuthn implementation for App Lock.
 * Since SpendWise is a PWA without an auth backend for biometrics, we generate
 * and store the credential ID locally. This is sufficient for a local "App Lock"
 * feature to prevent casual snooping.
 */

// Helper to convert string/array buffer
function bufferEncode(value: string): Uint8Array {
    return new TextEncoder().encode(value);
}

export async function isBiometricsSupported(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
        return false;
    }
    try {
        return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
        return false;
    }
}

export async function registerBiometrics(): Promise<string | null> {
    if (!(await isBiometricsSupported())) return null;

    try {
        const userId = crypto.randomUUID();
        const challenge = crypto.getRandomValues(new Uint8Array(32));

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: challenge.buffer as ArrayBuffer,
                rp: {
                    name: "SpendWise App Lock",
                    id: window.location.hostname
                },
                user: {
                    id: bufferEncode(userId).buffer as ArrayBuffer,
                    name: "SpendWise User",
                    displayName: "SpendWise App Lock User"
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },  // ES256
                    { type: "public-key", alg: -257 } // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Force FaceID/TouchID/Windows Hello
                    userVerification: "required"
                },
                timeout: 60000,
            }
        });

        if (credential && credential.id) {
            return credential.id;
        }
        return null;
    } catch (error) {
        console.error("Biometric registration failed:", error);
        return null;
    }
}

export async function verifyBiometrics(credentialId: string): Promise<boolean> {
    try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));

        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: challenge.buffer as ArrayBuffer,
                rpId: window.location.hostname,
                allowCredentials: [{
                    id: Uint8Array.from(atob(credentialId.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)).buffer as ArrayBuffer,
                    type: "public-key"
                }],
                userVerification: "required",
                timeout: 60000
            }
        });

        return !!credential;
    } catch (error) {
        console.error("Biometric verification failed:", error);
        return false;
    }
}
