import { useNavigate } from "react-router-dom";
import Loading from "../../common/components/Loading";
import { useEffect } from "react";
import { useOrgContext } from "../../common/contexts/OrgContext";

interface OrganizationWrapperProps {
  children: React.ReactNode;
}

export default function OrganizationWrapper({ children }: OrganizationWrapperProps) {
  const navigate = useNavigate()
  const { org } = useOrgContext()

  // Protected route: Waits for organization to load, then checks for organization, if it does not exist, navigate away to dashboard.
  // First-time users are routed to profile and forced to input username.
  useEffect(() => {
    console.log("OrganizationWrapper useEffect triggered!")
    console.log(org)

    if (!org) {
      console.log("OrganizationWrapper navigating to /dashboard")
      navigate('/dashboard')
    } 

  }, [org]);

  // Ensures users are logged in before rendering the page
  if (!org) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
}
