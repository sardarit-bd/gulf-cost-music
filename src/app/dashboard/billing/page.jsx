"use client";

import RoleSidebarLayout from '@/components/modules/dashboard/RoleSidebarLayout';
import BillingPage from '@/components/shared/billing/BillingPage';
import CustomLoader from '@/components/shared/loader/Loader';
import { useAuth } from '@/context/AuthContext';

const Billing = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CustomLoader />
            </div>
        );
    }

    return (
        <RoleSidebarLayout role={user?.userType}>
            <BillingPage userType={user?.userType} />
        </RoleSidebarLayout>
    );
};

export default Billing;