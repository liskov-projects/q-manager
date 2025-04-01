export default function UserNotifications() {
  const user = async () => {
    await fetch("/api/user");
  };
  return (
    <div>
      <input type="text" value={user.phoneNumber} />
    </div>
  );
}
