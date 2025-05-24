import React, { useEffect } from 'react';
import './Home.css';

interface HomeProps {
    setPageTitle: (arg0: string) => void;
}

function Home ({ setPageTitle }: HomeProps) {

    useEffect(() => {
        setPageTitle("Home")
    }, [])
    return (<><p>DADA</p></>);
}

export default Home;