import { useEffect } from 'react';
import { connectivityService } from '@core/connectivity';
import { useGlobal } from '@/contexts';

export const ConnectivityEffectManager = () => {
    const { toastShow } = useGlobal();

    useEffect(() => {
        const unsubscribe = connectivityService.addEventListener((event) => {
            if (event.type === 'NETWORK_ONLINE') {
                toastShow('网络已恢复', { type: 'success', position: 'top' });
            } else if (event.type === 'NETWORK_OFFLINE') {
                toastShow('网络已断开', { type: 'warning', position: 'top' });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return null;
};
