import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../common/contexts/SessionContext";
import Loading from "../../common/components/Loading";
import { useAlertContext } from "../../common/contexts/AlertContext";
import { useEffect } from "react";

interface SessionWrapperProps {
  children: React.ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  const navigate = useNavigate()
  const { user } = useSessionContext()
  const { createAlert } = useAlertContext()

  // Protected route: Waits for session to load, then checks for session, if it does not exist, navigate away.
  // First-time users are routed to profile and forced to input username.
  useEffect(() => {
    console.log("SessionWrapper useEffect triggered!")

    if (!user) {
      console.log("SessionWrapper navigating to /")
      createAlert("info","Your session has expired. Please log in to continue.")
      navigate('/')
    } else if (user) {
      new Promise(async () => {
        if (user.name === null) {
          createAlert("info", "Please enter in a username");
          navigate("/dashboard/profile");
        }
      })
    }
  }, [navigate]);

  // Ensures users are logged in before rendering the page
  if (!user) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
}
