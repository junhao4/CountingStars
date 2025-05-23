import './Button.css'
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

interface ButtonProps {
    children : React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    buttonStyle?: string;
    buttonSize?: string;
    to?: string;

}


function Button({
    children,
    type = 'button',
    onClick,
    buttonStyle,
    buttonSize,
    to,
}: ButtonProps) {

    const checkButtonStyle = STYLES.includes(buttonStyle || '') ? buttonStyle : STYLES[0];
    const checkButtonSize = STYLES.includes(buttonSize || '') ? buttonSize : SIZES[0];

    const buttonName =`btn ${checkButtonStyle} ${checkButtonSize}`;

    if (to) {
        return (
            <Link to={to} className={buttonName}> {children} </Link>
        );
    } else {
        return (
            <button
                className={buttonName}
                onClick={onClick}
                type={type}
            > {children}
            </button>
        );
    }


}


export default Button