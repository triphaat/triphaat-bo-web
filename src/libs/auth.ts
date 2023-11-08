// third-party
import { GetServerSidePropsContext } from 'next';

// application
import { getCookie, setCookie, removeCookie, parseCookie, ICookie } from './cookie';

export const getCustomer = () => JSON.parse(getCookie('customer'));
export const setCustomer = (value: string) => setCookie('customer', JSON.stringify(value));
export const getVendor = () => JSON.parse(getCookie('vendor'));
export const setVendor = (value: string) => setCookie('vendor', JSON.stringify(value));
export const getAccessType = () => getCookie('accessType');
export const setAccessType = (value: string) => setCookie('accessType', value);
export const getAccessToken = () => getCookie('accessToken');
export const setAccessToken = (value: string) => setCookie('accessToken', value);

export const createLogin = (user: any, accessType: string, accessToken: string, vendor?: any): boolean => {
    try {
        setCustomer(user);
        setAccessType(accessType);
        setAccessToken(accessToken);

        if (vendor) {
            setVendor(vendor);
        }

        return true;
    } catch (error) {
        console.error('error', error);

        return false;
    }
};

export const isLoggedIn = () => {
    if (!getCustomer || !getAccessType || !getAccessToken) return false;

    return true;
};

export const destroyLogin = (): boolean => {
    try {
        removeCookie('user');
        removeCookie('vendor');
        removeCookie('accessType');
        removeCookie('accessToken');

        return true;
    } catch (error) {
        console.error('error', error);

        return false;
    }
};

export const getServerSideCookie = (req: any): ICookie | null => {
    if (!req) return null;

    if (!req.headers) return null;

    if (!req.headers.cookie) return null;

    return parseCookie(req.headers.cookie);
};

export const getAuthorized = async (
    context: GetServerSidePropsContext,
    title: string,
    callback?: (cookies: any) => any
) => {
    const { req } = context;
    const cookies = getServerSideCookie(req);

    if (!cookies?.user || !cookies?.accessType || !cookies?.accessToken) {
        return {
            redirect: {
                destination: !req.url?.includes('/v-p') ? '/auth/login' : '/v-p/auth/login',
                permanent: false,
            },
        };
    }

    const user = JSON.parse(cookies?.user);

    if (user.type === 'TRIPHAAT_ADMIN' && req.url?.includes('/v-p')) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (user.type === 'VENDOR_ADMIN' && !req.url?.includes('/v-p')) {
        return {
            redirect: {
                destination: '/v-p/',
                permanent: false,
            },
        };
    }

    let data = null;

    if (callback) data = await callback(cookies);

    if (data?.redirect) return { redirect: data.redirect };

    return {
        props: { title, ...data } ?? { title },
    };
};
