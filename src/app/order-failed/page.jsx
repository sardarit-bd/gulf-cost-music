import { redirect } from "next/navigation";

export default function OrderFailedRedirect() {
  redirect("/order-cancel");
}
