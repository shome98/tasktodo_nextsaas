"use client";
import { PaymentMode } from "@/types/requiredtypes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { PaymentModeTable } from "../paymentmode/PaymentModeTable";
import { PaymentModeModalForm } from "../paymentmode/PaymentModeModalForm";
import Loading from "../Loading";
import { fetchPaymentModes, createOrUpdatePaymentMode, deletePaymentMode } from "@/lib/server/paymentmode.actions";

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
      fetchPaymentModes()
        .then(setPaymentModes)
        .catch((error) => {
          const message = error instanceof Error ? error.message : "Unknown error from payment modes.";
          toast.error("Error", { description: `😵 ${message}` });
        });
    }
  }, [status, session, router]);

  const handleCreateOrUpdatePaymentMode = async (data: { name: string }) => {
    try {
      await createOrUpdatePaymentMode({ ...data, _id: editingPaymentMode?._id });
      const updatedPaymentModes = await fetchPaymentModes();
      setPaymentModes(updatedPaymentModes);
      setEditingPaymentMode(null);
      setIsPaymentModeModalOpen(false);
      toast.success(editingPaymentMode ? "😊 Payment Mode Updated" : "😊 Payment Mode Created", {
        description: `The payment mode has been ${editingPaymentMode ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error", { description: `😵 ${message}` });
    }
  };

  const handleDeletePaymentMode = async (id: string) => {
    try {
      await deletePaymentMode(id);
      const updatedPaymentModes = await fetchPaymentModes();
      setPaymentModes(updatedPaymentModes);
      toast.success("😊 Payment Mode Deleted", { description: "😊 The payment mode has been successfully removed." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error", { description: `😵 ${message}` });
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
    return <Loading name={"Payment Modes"} />;
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
};

export default PaymentModeViewv1;