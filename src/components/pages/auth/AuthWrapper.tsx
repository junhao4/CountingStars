import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../contexts/SessionContext";
import Loading from "../../general/Loading";
import { useMessageContext } from "../../contexts/MessageContext";
import supabase from "../../../helper/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { usePageTitleContext } from "../../contexts/PageTitleContext";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const navigate = useNavigate();
  const { session, loading } = useSessionContext();
  const { createMessage } = useMessageContext();
  const { title } = usePageTitleContext();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/')
    } else if (!loading && session) {
      const haveName = async (user: User) => {
        console.log(title);
        const { data } = await supabase
          .from("Users")
          .select("name")
          .eq("user_id", user!.id);

        if (title == "Profile" || data![0].name != null) {
<<<<<<< HEAD
          return true;
        } else {
=======
          console.log("name exists", data);
          return true;
        } else {
          console.log("name dosent exists", data);
>>>>>>> main
          createMessage("error", "Please enter in a username");
          navigate("/dashboard/profile");
        }
      }

      haveName(session.user)
    }

  }, [session]);

  // Ensures users are logged in before rendering the page
  if (loading) {
    return <Loading />;
  } else if (!session) {
    createMessage(
      "error",
      "Session does not exist or is expired! Please login again"
    );
    navigate("/login");
  } else {
    return <>{children}</>;
  }
}
