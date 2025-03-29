// components/views/PaymentModeViewv1.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { PaymentMode } from "@/types/requiredtypes";
import { PaymentModeTable } from "../paymentmode/PaymentModeTable";
import { PaymentModeModalForm } from "../paymentmode/PaymentModeModalForm";
import Loading from "../Loading";
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import {
  fetchPaymentModesThunk,
  createOrUpdatePaymentModeThunk,
  deletePaymentModeThunk
} from '@/lib/redux/slices/paymentModeSlice';

const PaymentModeViewv1 = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: paymentModes, loading } = useAppSelector((state) => state.paymentModes);

  const [editingPaymentMode, setEditingPaymentMode] = React.useState<PaymentMode | null>(null);
  const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.id) {
      dispatch(fetchPaymentModesThunk()).catch((error) => {
        toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error from payment modes"}` });
      });
    }
  }, [status, session, router, dispatch]);

  const handleCreateOrUpdatePaymentMode = async (data: { name: string }) => {
    try {
      await dispatch(createOrUpdatePaymentModeThunk({ ...data, _id: editingPaymentMode?._id })).unwrap();
      setEditingPaymentMode(null);
      setIsPaymentModeModalOpen(false);
      toast.success(editingPaymentMode ? "😊 Payment Mode Updated" : "😊 Payment Mode Created", {
        description: `The payment mode has been ${editingPaymentMode ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
    }
  };

  const handleDeletePaymentMode = async (id: string) => {
    try {
      await dispatch(deletePaymentModeThunk(id)).unwrap();
      toast.success("😊 Payment Mode Deleted", { description: "😊 The payment mode has been successfully removed." });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
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

  if (status === "loading" || loading) {
    return <Loading name={"Payment Modes"} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8">
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
};

export default PaymentModeViewv1;