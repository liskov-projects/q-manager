import { toast } from "sonner";

export default function NotificationToast() {
  return <button onClick={() => toast("Toast")}>Render Toast</button>;
}
