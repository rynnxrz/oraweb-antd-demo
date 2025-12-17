// Dummy implementation to satisfy build since axios is not installed yet
// and HTTP layer is unused.
export const api = {
    request: async (...args: any[]): Promise<any> => {
        console.warn('HTTP Layer is not active. Mock request:', args);
        return { data: [] }; // Return something universally mappable if possible, or just any
    }
};
