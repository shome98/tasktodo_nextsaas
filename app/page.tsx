//import TodoView from "@/components/todos/TodoView";
import TodoViewTable from "@/components/todos/TodoViewTable";

import HomeViewTwo from "@/components/HomeViewTwo";

//import HomeViewOne from "@/components/HomeViewOne";

export default function Home() {
  return (
    <>
      <TodoViewTable/>
      {/* <HomeViewOne/> */}
      <HomeViewTwo/>
    </>
  );
}
