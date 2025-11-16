export const safeParseDate = (iso?: string): Date => {
    if (!iso) return new Date(0);
    const t = Date.parse(iso);
    return Number.isNaN(t) ? new Date(0) : new Date(t);
};