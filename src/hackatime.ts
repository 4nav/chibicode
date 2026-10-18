const apiBase = "https://hackatime.hackclub.com";
const cacheMs = 3*60*1000;
const timeoutMs = 5000;

export interface TodayStats{
    totalSeconds: number;
    text: string;
}

export interface WeeklyStats {
    totalSeconds: number;
    dailyAverage: number | undefined;
}

export interface DailySummary {
    date: string;
    totalSeconds: number;
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

interface WeeklyResponse{
    data: {
        grand_total?: {
            total_seconds?:number;
        };
        total_seconds?: number;
        daily_average?: {
            total_seconds?: number;
        } | number;
    };
}

interface SummaryResponse {
    data: Array<{
        range?: {
            date?: string;
        };
        grand_total?: {
            total_seconds?: number;
        };
    }>;
}

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

const todayCache = new Map<string, CacheEntry<TodayStats>>();
const weeklyCache = new Map<string, CacheEntry<WeeklyStats>>();
const summariesCache = new Map<string, CacheEntry<DailySummary[]>>();

export function clearHackatimeCache(): void {
    todayCache.clear();
    weeklyCache.clear();
    summariesCache.clear();
}

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


function getCached<T>(cache: Map<string, CacheEntry<T>>, key:string): T|undefined{
    const entry = cache.get(key);
    if(!entry){
        return undefined;
    }
    if (Date.now() >= entry.expiresAt) {
        cache.delete(key);
        return undefined;
    }   
    return entry.value;
}

function setCached<T>(cache: Map<string, CacheEntry<T>>,key: string,value: T): void{
    cache.set(key, {value, expiresAt: Date.now() + cacheMs});
}


export async function getTodayStats(token: string): Promise<TodayStats|undefined> {
    const cached = getCached(todayCache, token);
    if(cached){
        return cached;
    }

    const response = await apiGet<TodayResponse>(
        "/api/hackatime/v1/users/current/statusbar/today",
        token
    );
    console.log('ChibiCode: Today response:', response);

    const total = response?.data?.grand_total;


    if(!total || typeof total.total_seconds !== 'number' || typeof total.text !== 'string'){
        console.error(
        'ChibiCode: Unexpected Hackatime response structure:',
        response ? Object.keys(response) : 'No response'
    );
        return undefined;
    }

    const stats: TodayStats = {
        totalSeconds: total.total_seconds,
        text: total.text    ,
    };

    setCached(todayCache, token, stats);

    return stats;
}


export async function getWeeklyStats(token: string): Promise<WeeklyStats | undefined> {
    const cached = getCached(weeklyCache, token);

    if (cached) {
        return cached;
    }

    const response = await apiGet<WeeklyResponse>(
        '/api/hackatime/v1/users/current/stats/last_7_days',
        token
    );

    if (!response?.data) {
        return undefined;
    }

    console.log('ChibiCode: Weekly response:', response);


    const data = response.data;
    const totalSeconds = data.grand_total?.total_seconds ?? data.total_seconds;

    const average = data.daily_average;
    const dailyAverage = typeof average === 'number'? average: average?.total_seconds;

    if (typeof totalSeconds !== 'number') {
        console.error(
            'ChibiCode: Unexpected weekly stats response:',
            response
        );
        return undefined;
    }

    const stats: WeeklyStats = {
        totalSeconds,
        dailyAverage,
    };

    setCached(weeklyCache, token, stats);
    return stats;
}

export async function getDailySummaries(token: string, startDate: string,endDate: string): Promise<DailySummary[]|undefined> {
    const cacheKey = `${token}:${startDate}:${endDate}`;
    const cached = getCached(summariesCache, cacheKey);
    
    if(cached){
        return cached;
    }

    const query = new URLSearchParams({
        start: startDate,
        end: endDate
    });

    const response = await apiGet<SummaryResponse>(
        `/api/hackatime/v1/users/current/summaries?${query.toString()}`,
        token
    );
    console.log('ChibiCode: Summary records:',JSON.stringify(response?.data, null, 2));

    if(!response  || !Array.isArray(response.data)){
        console.error('ChibiCode: Unexpected daily summaries response',);
        return undefined;
    }

    console.log('ChibiCode: Summary response:', response);

    const summaries: DailySummary[] = [];

    for(const item of response.data){
        const date = item.range?.date;
        const totalSeconds = item.grand_total?.total_seconds;

        if(typeof date !== 'string' || typeof totalSeconds !== 'number'){
            continue;
        }
        summaries.push({date, totalSeconds});
    }

    setCached(summariesCache, cacheKey, summaries);
    return summaries;


}