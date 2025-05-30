import { useEffect } from 'react';
import './Home.css';
import { usePageTitleContext } from '../contexts/PageTitleContext';
import { useSessionContext } from '../contexts/SessionContext';
import Button from '../Button';


function Home () {

    //Set header title to Home
    const { title, setTitle } = usePageTitleContext();
    const { session } = useSessionContext();
    
    useEffect(() => {
        console.log("Setting title to Home")
        setTitle("Home");
        console.log(title)
    }, [])
    //

    if (!session) {
        return (<><p>DADA</p></>);
    } else {
        return <>
        <p></p>
        <Button to='/dashboard'> Dashboard </Button>
        </>
    }
}

export default Home;