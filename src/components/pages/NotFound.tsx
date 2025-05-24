import './NotFound.css'
import Button from '../Button'

function NotFound() {

    return (
        <>
            <h1 className="head">Oops! This page does not exist.</h1>
            <Button to="/">Back to Home</Button>
        </>
    )
}

export default NotFound