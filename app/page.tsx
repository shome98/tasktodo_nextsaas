import TodoViewv1 from "@/components/views/TodoViewv1";
import PaymentModeViewv1 from "@/components/views/PaymentModeViewv1";
import CategoryViewv1 from "@/components/views/CategoryViewv1";
import Expenseviewv1 from "@/components/views/ExpenseViewv1";

export default function Home() {
  return (
    <>
      <TodoViewv1 />
      <PaymentModeViewv1 />
      <CategoryViewv1 />
      <Expenseviewv1/>
    </>
  );
}
