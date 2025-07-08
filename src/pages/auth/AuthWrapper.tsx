import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../common/contexts/SessionContext";
import Loading from "../../common/components/Loading";
import { useAlertContext } from "../../common/contexts/AlertContext";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const navigate = useNavigate();
  const { user, loading } = useSessionContext();
  const { createAlert } = useAlertContext();

  // Protected route: Checks for session, if it does not exist, navigate away.
  // First-time users are routed to profile and forced to input username.
  useEffect(() => {
    console.log("Authwrapper useEffect triggered!")

    if (!loading && !user) {
      console.log("Authwrapper navigating to /")
      createAlert("info","Your session has expired. Please log in to continue.")
      navigate('/')
    } else if (!loading && user) {
      new Promise(async () => {
        if (user.name === null) {
          createAlert("info", "Please enter in a username");
          navigate("/dashboard/profile");
        }
      })
    }
  }, [loading, navigate]);

  // Ensures users are logged in before rendering the page
  if (loading || !user) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
}
