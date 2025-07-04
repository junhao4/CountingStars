import { useEffect } from "react";
import { usePageTitleContext } from "../../contexts/PageTitleContext";
import EmailRegisterForm from "./EmailRegisterForm";
import { useSessionContext } from "../../contexts/SessionContext";
import { useNavigate } from "react-router-dom";

export function Register() {
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
