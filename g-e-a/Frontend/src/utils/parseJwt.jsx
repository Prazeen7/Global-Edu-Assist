/**
 * Parses a JWT token and returns the decoded payload
 * @param {string} token - The JWT token to parse
 * @returns {object|null} The decoded token payload or null if invalid
 */
const parseJwt = (token) => {
    try {
        if (!token) return null

        // Split the token and get the payload part (second part)
        const base64Url = token.split(".")[1]
        if (!base64Url) return null

        // Replace characters that are not valid for base64 URL encoding
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")

        // Decode the base64 string
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
        )

        // Parse the JSON string to an object
        return JSON.parse(jsonPayload)
    } catch (error) {
        console.error("Error parsing JWT token:", error)
        return null
    }
}

export default parseJwt
