import { createContext, useContext, useState } from "react"

 interface PageTitleProps {
        title: string
        setTitle: (title : string) => void;
    }


const PageTitleContext = 
    createContext<PageTitleProps>({
        title: "",
        setTitle: (arg0: string) => {},
    })


export default PageTitleContext

export const PageTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("Dashboard");

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitleContext = () => useContext(PageTitleContext);


