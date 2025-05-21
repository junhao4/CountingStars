import './NotFound.css'
import {Link} from 'react-router-dom'

function NotFound() {

    return (
        <>
            <h1 className="head">Oops! The page does not exist.</h1>
            <Link to="/">Back to Home</Link>
        </>
    )
}

export default NotFound