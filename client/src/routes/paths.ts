// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
    return `${root}${sublink}`;
}

const ROOTS = {
    AUTH: '/auth',
    DASHBOARD: '/',
};

export const paths = {
    // AUTH
    auth: {
        login: path(ROOTS.AUTH, '/login'),
        register: path(ROOTS.AUTH, '/register'),
        forgotPassword: path(ROOTS.AUTH, '/forgot-password'),
    },
    campaigns: {
        root: path(ROOTS.DASHBOARD, 'campaigns'),
        list: path(ROOTS.DASHBOARD, 'campaigns'),
        new: path(ROOTS.DASHBOARD, 'campaigns/new'),
        edit: (id: string) => path(ROOTS.DASHBOARD, `campaigns/edit/${id}`),
        view: (id: string) => path(ROOTS.DASHBOARD, `campaigns/${id}`),
    },
} as const;