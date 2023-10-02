
export type FetchMethodsType  = 'POST' | 'PUT' | 'GET' | 'DELETE';

export const fetchBackend = async <T = Record<string, unknown>>(url: string, data: T | null = null, method: FetchMethodsType = 'GET') => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) headers['Authorization'] = ` Bearer ${accessToken}`;

    try {
        const result = await fetch(`http://localhost:3000/${url}`, {
            headers: headers,
            method: method,
            body: data ? JSON.stringify(data) : undefined
        });
        return result?.headers?.get('Content-Type')?.includes('json') ? result?.json() : result?.text();
    } catch(e) {
        console.error(`fetch to ${url} by ${method} error: `, e);
    }
}