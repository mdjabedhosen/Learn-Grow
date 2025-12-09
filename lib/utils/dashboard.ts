/**
 * Get the correct dashboard URL based on user role
 */
export function getDashboardUrl(role?: string): string {
    if (!role) {
        // Try to get from localStorage
        if (typeof window !== 'undefined') {
            role = localStorage.getItem('userRole') || 'student';
        } else {
            return '/student'; // default to student dashboard
        }
    }

    switch (role.toLowerCase()) {
        case 'admin':
            return '/admin';
        case 'instructor':
        case 'teacher':
            return '/instructor';
        case 'guardian':
        case 'parent':
            return '/guardian';
        case 'student':
        default:
            return '/student'; // Changed from /dashboard to /student
    }
}

/**
 * Redirect to the correct dashboard based on user role
 */
export function redirectToDashboard(role?: string) {
    if (typeof window !== 'undefined') {
        const url = getDashboardUrl(role);
        window.location.href = url;
    }
}
