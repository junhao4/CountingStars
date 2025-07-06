import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../contexts/SessionContext";
import Loading from "../../general/Loading";
import { useMessageContext } from "../../contexts/MessageContext";
import { useEffect } from "react";
import { isFirstTimeUser } from "./AuthController";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const navigate = useNavigate();
  const { session, loading } = useSessionContext();
  const { createMessage } = useMessageContext();

  // Protected route: Checks for session, if it does not exist, navigate away.
  // First-time users are routed to profile and forced to input username.
  useEffect(() => {
    console.log("Authwrapper useEffect triggered!")

    if (!loading && !session) {
      console.log("Authwrapper navigating to /")
      navigate('/')
    } else if (!loading && session) {
      new Promise(async () => {
        if (await isFirstTimeUser(session.user.id)) {
          createMessage("info", "Please enter in a username");
          navigate("/dashboard/profile");
        }
      })
    }
  }, [loading, navigate]);

  // Ensures users are logged in before rendering the page
  if (loading || !session) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
}
