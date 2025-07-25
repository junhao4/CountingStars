import { useEffect } from 'react';
import { usePageTitleContext } from '../../common/contexts/PageTitleContext';
import Home from '../../features/home/components/Home';

export default function HomePage() {
    const { setTitle } = usePageTitleContext()

    useEffect(() => {
        setTitle("Home")
    }, [])

    return (
        <Home />
    )
}