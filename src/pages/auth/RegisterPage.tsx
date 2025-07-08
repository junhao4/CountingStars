import { useEffect } from "react";
import { usePageTitleContext } from "../../common/contexts/PageTitleContext";
import { useSessionContext } from "../../common/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import EmailRegisterForm from "../../features/authentication/components/EmailRegisterForm";

export default function RegisterPage() {
  const { setTitle } = usePageTitleContext()
  const { user } = useSessionContext()
  const navigate = useNavigate()

  useEffect(() => {
    setTitle("Registration");

    if (user) {
      navigate('/dashboard')
    }
  }, []);

  return (
      <EmailRegisterForm />
  )
}
