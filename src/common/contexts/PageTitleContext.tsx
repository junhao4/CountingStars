import { createContext, useContext, useState } from "react"

 interface PageTitleProps {
        title: string
        setTitle: (title : string) => void;
    }


export const PageTitleContext = 
    createContext<PageTitleProps>({
        title: "",
        setTitle: () => {},
    })


export const PageTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("Home");

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitleContext = () => useContext(PageTitleContext);


