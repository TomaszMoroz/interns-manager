import UserList from "@/components/UserList.vue";
import AddUser from "@/components/AddUser.vue";
import EditUser from "@/components/EditUser.vue";

const routes = [
  {
    path: "/",
    name: "UserList",
    component: UserList,
  },
  {
    path: "/add-user",
    name: "AddUser",
    component: AddUser,
  },
  {
    path: "/edit-user/:id",
    name: "EditUser",
    component: EditUser,
    props: true
  },
];

export default routes