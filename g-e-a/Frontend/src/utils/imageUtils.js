/**
 * Get the full image URL, handling both Cloudinary URLs and legacy local paths
 * @param {string|object} imageData - Image URL string or image object with url property
 * @returns {string} Full image URL
 */
export const getImageUrl = (imageData) => {
    // Handle null/undefined
    if (!imageData) return null;

    // Handle blob URLs (temporary preview URLs)
    if (typeof imageData === 'string' && imageData.startsWith('blob:')) {
        return imageData;
    }

    // Handle object with url property
    if (typeof imageData === 'object' && imageData.url) {
        return getImageUrl(imageData.url);
    }

    // Handle string URLs
    if (typeof imageData === 'string') {
        // Already a full URL (Cloudinary or other CDN)
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
            return imageData;
        }

        // Legacy local path - prepend server URL
        if (imageData.startsWith('/uploads/') || !imageData.startsWith('/')) {
            const cleanPath = imageData.startsWith('/') ? imageData : `/uploads/${imageData}`;
            return `https://global-edu-assist.onrender.com${cleanPath}`;
        }

        // Path without /uploads prefix
        return `https://global-edu-assist.onrender.com/uploads/${imageData}`;
    }

    return null;
};

/**
 * Get profile picture URL with fallback
 * @param {string|object} profilePicture - Profile picture data
 * @param {string} fallbackUrl - Optional fallback image URL
 * @returns {string} Profile picture URL or fallback
 */
export const getProfilePictureUrl = (profilePicture, fallbackUrl = null) => {
    return getImageUrl(profilePicture) || fallbackUrl;
};

/**
 * Get array of image URLs
 * @param {Array<string|object>} images - Array of image data
 * @returns {Array<string>} Array of image URLs
 */
export const getImageUrls = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => getImageUrl(img)).filter(Boolean);
};
