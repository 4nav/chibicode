const apiBase = "https://hackatime.hackclub.com";
const cacheMs = 3*60*1000;
const timeoutMs = 5000;

export interface TodayStats{
    totalSeconds: number;
    text: string;
}

interface TodayResponse{
    data: {
        grand_total: {
            total_seconds: number;
            text: string;
        };

        goal?: {
            target_seconds: number;
            tracked_seconds: number;
            completion_percent: number;
            complete: boolean;
        }| null;
    };
}

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

let todayCache: CacheEntry<TodayStats> | undefined;

async function apiGet<T>(path: string,token: string): Promise<T | undefined>{
    const controller = new AbortController;
    const timeout = setTimeout(() => controller.abort(),timeoutMs);

    try{
        const response = await fetch(`${apiBase}${path}`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
        if(!response.ok){
            console.error(
                'ChibiCode: Hackatime API error:',
                response.status,
                response.statusText
            );
            return undefined;
        }
        return await response.json() as T;
    } catch(error){
        console.error('ChibiCode: Hackatime request failed:', error);
        return undefined;
    }
    finally{
        clearTimeout(timeout);
    }
}   

export async function getTodayStats(token: string): Promise<TodayStats|undefined> {
    if (todayCache  && Date.now() < todayCache.expiresAt){
        return todayCache.value;
    }
    const response = await apiGet<TodayResponse>(
        "/api/hackatime/v1/users/current/statusbar/today",
        token
    );

    if(!response?.data.grand_total){
        console.error(
        'ChibiCode: Unexpected Hackatime response structure:',
        response ? Object.keys(response) : 'No response'
    );
        return undefined;
    }

    const stats: TodayStats = {
        totalSeconds: response.data.grand_total.total_seconds,
        text: response.data.grand_total.text    ,
    };

    todayCache = {
        value: stats,
        expiresAt: Date.now() + cacheMs,
    };

    return stats;
}