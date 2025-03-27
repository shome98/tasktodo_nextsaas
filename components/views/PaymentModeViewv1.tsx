"use client";
import { PaymentMode } from '@/types/requiredtypes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { PaymentModeTable } from '../paymentmode/PaymentModeTable';
import { PaymentModeModalForm } from '../paymentmode/PaymentModeModalForm';
import Loading from '../Loading';

const PaymentModeViewv1 = () => {
    const { status, data: session } = useSession();
    const router = useRouter();
    const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
    const [editingPaymentMode, setEditingPaymentMode] = React.useState<PaymentMode | null>(null);
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = React.useState(false);

    React.useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchPaymentModes();
        }
    }, [status, session, router]);

    const fetchPaymentModes = async () => {
        const res = await fetch(`/api/expenses/paymentmode?userId=${session?.user?.id}`);
        const data = await res.json();
        if (data.paymentModes) setPaymentModes(data.paymentModes);
    };

    const handleCreateOrUpdatePaymentMode = async (data: { name: string }) => {
        const method = editingPaymentMode ? "PUT" : "POST";
        const url = editingPaymentMode ? `/api/expenses/paymentmode/${editingPaymentMode._id}` : "/api/expenses/paymentmode";
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId: session?.user?.id, _id: editingPaymentMode?._id }),
        });
        if (response.ok) {
            await fetchPaymentModes();
            setEditingPaymentMode(null);
            toast.success(editingPaymentMode ? "😊 Payment Mode Updated" : "😊 Payment Mode Created", {
                description: `The payment mode has been ${editingPaymentMode ? "updated" : "created"} successfully.`,
            });
        } else {
            const errorData = await response.json();
            toast.error("Error", { description:` 😵 ${errorData.error} `});
        }
    };

    const handleDeletePaymentMode = async (id: string) => {
        const response = await fetch(`/api/expenses/paymentmode?_id=${id}&userId=${session?.user?.id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            fetchPaymentModes();
            toast.success("😊 Payment Mode Deleted", { description: "😊 The payment mode has been successfully removed." });
        } else {
            const errorData = await response.json();
            toast.error("Error", { description:` 😵 ${errorData.error} `});
        }
    };

    const handleEditPaymentMode = (paymentMode: PaymentMode) => {
        setEditingPaymentMode(paymentMode);
        setIsPaymentModeModalOpen(true);
    };

    const handleCancelEditPaymentMode = () => {
        setEditingPaymentMode(null);
        setIsPaymentModeModalOpen(false);
    };

    if (status === "loading") {
        return <Loading name={"Payment Modes"}/>
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8 pt-24">
            <section className="mb-12">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Payment Modes</h2>
                <div className="mb-8 flex justify-end">
                    <PaymentModeModalForm
                        onSubmit={handleCreateOrUpdatePaymentMode}
                        initialData={editingPaymentMode || undefined}
                        onCancel={handleCancelEditPaymentMode}
                        isOpen={isPaymentModeModalOpen}
                        setIsOpen={setIsPaymentModeModalOpen}
                    />
                </div>
                <PaymentModeTable
                    paymentModes={paymentModes}
                    onEdit={handleEditPaymentMode}
                    onDelete={handleDeletePaymentMode}
                />
            </section>
        </div>
    );
}

export default PaymentModeViewv1