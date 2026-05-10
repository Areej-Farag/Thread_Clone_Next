import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div>
      <h1 className="head-text">Sign In Page</h1>
      <SignIn />
    </div>
  );
}
