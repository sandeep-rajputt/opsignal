"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { hideAddWorkspaceSlot } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import {
  useCreateSlotOrderMutation,
  useVerifySlotPaymentMutation,
} from "@/Store/api/paymentApi/paymentApi";
import { loadRazorpayScript, openRazorpay } from "@/utils/razorpay";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

function AddWorkspaceSlotDialog() {
  const workspaceSlot = useAppSelector(
    (state) => state.dialogs.addWorkspaceSlot,
  );
  const dispatch = useAppDispatch();
  const [createSlotOrder, { isLoading }] = useCreateSlotOrderMutation();
  const [verifySlotPayment] = useVerifySlotPaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleAddSlot() {
    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        setIsProcessing(false);
        return;
      }

      const orderRes = await createSlotOrder().unwrap();

      openRazorpay({
        key: orderRes.data.key,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "OPSIGNAL",
        description: "Add Workspace Slot",
        order_id: orderRes.data.orderId,
        handler: async (response) => {
          try {
            await verifySlotPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            toast.success("Workspace slot added successfully!");
            dispatch(hideAddWorkspaceSlot());
            setIsProcessing(false);
            window.location.reload();
          } catch (error) {
            console.log(error);
            toast.error("Payment verification failed");
            dispatch(hideAddWorkspaceSlot());
            setIsProcessing(false);
          }
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            dispatch(hideAddWorkspaceSlot());
            setIsProcessing(false);
          },
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to create payment order");
      setIsProcessing(false);
    }
  }

  return (
    <Dialog
      open={workspaceSlot}
      onOpenChange={() => dispatch(hideAddWorkspaceSlot())}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Add workspace slot</DialogTitle>
          <DialogDescription>
            Are you sure you want to add a workspace slot? This will cost ₹10.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => dispatch(hideAddWorkspaceSlot())}
            disabled={isLoading || isProcessing}
          >
            Cancel
          </Button>

          <Button
            onClick={handleAddSlot}
            className="flex gap-2 items-center justify-center"
            disabled={isLoading || isProcessing}
          >
            {isLoading || isProcessing ? (
              <>
                Processing <Spinner />
              </>
            ) : (
              "Add Slot"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddWorkspaceSlotDialog;
