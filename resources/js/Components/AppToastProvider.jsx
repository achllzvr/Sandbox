import { useEffect } from 'react';
import AppToastStack from '@/Components/AppToastStack';
import { useFlashToasts } from '@/hooks/useFlashToasts';
import { registerAppToastPush } from '@/Utils/appToast';

export default function AppToastProvider({ children }) {
    const { toasts, pushToast } = useFlashToasts();

    useEffect(() => {
        registerAppToastPush(pushToast);
        return () => registerAppToastPush(null);
    }, [pushToast]);

    return (
        <>
            {children}
            <AppToastStack toasts={toasts} />
        </>
    );
}
