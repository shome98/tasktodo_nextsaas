//import TodoView from "@/components/todos/TodoView";
import TodoViewTable from "@/components/todos/TodoViewTable";

import HomeViewTwo from "@/components/HomeViewTwo";
import TodoViewv1 from "@/components/views/TodoViewv1";
import PaymentModeViewv1 from "@/components/views/PaymentModeViewv1";
import CategoryViewv1 from "@/components/views/CategoryViewv1";
import Expenseviewv1 from "@/components/views/ExpenseViewv1";

//import HomeViewOne from "@/components/HomeViewOne";

export default function Home() {
  return (
    <>
      {/* <TodoViewTable/> */}
      {/* <HomeViewOne/> */}
      {/* <HomeViewTwo/> */}
      <TodoViewv1 />
      <PaymentModeViewv1 />
      <CategoryViewv1 />
      <Expenseviewv1/>
    </>
  );
}
