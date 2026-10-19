/**
 * Resolve an image value to a valid browser-loadable image URL or data URI.
 * Handles:
 * - Full URLs: https://... or http://...
 * - Protocol-relative URLs: //...
 * - Static local paths: /images/..., /uploads/..., /...
 * - Data URLs: data:image/...
 * - Blob URLs: blob:...
 * - Raw Base64 payloads (e.g. from FileReader): prepends data:image/jpeg;base64,
 */
export const resolveImageSrc = (value?: string | null): string => {
    if (!value || typeof value !== "string") return "";
    const clean = value.trim();
    if (!clean || clean === "placeholder") return "";

    // 1. Data URLs & Blob URLs
    if (clean.startsWith("data:image") || clean.startsWith("blob:")) {
        return clean;
    }

    // 2. Absolute HTTP/HTTPS URLs
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("//")) {
        return clean;
    }

    // 3. Root-relative or relative paths (e.g. /images/tutors/..., ./...)
    if (clean.startsWith("/") || clean.startsWith("./")) {
        return clean;
    }

    // 4. Missing leading slash for static directories
    if (clean.startsWith("images/") || clean.startsWith("uploads/")) {
        return `/${clean}`;
    }

    // 5. Bare filename with image extension
    if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(clean) && !clean.includes(";base64,")) {
        if (clean.startsWith("tutor-")) {
            return `/images/tutors/${clean}`;
        }
        return `/${clean}`;
    }

    // 6. Otherwise, treat as raw base64 image data
    return `data:image/jpeg;base64,${clean}`;
};
