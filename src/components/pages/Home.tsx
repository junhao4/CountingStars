import { useEffect } from 'react';
import './Home.css';
import { usePageTitleContext } from '../contexts/PageTitleContext';


function Home () {

    //Set header title to Home
    const { title, setTitle } = usePageTitleContext();
    
    useEffect(() => {
        console.log("Setting title to Home")
        setTitle("Home");
        console.log(title)
    }, [])
    //

    return (<><p>DADA</p></>);
}

export default Home;