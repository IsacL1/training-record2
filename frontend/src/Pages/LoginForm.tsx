import React, { useState } from 'react';
import "../Style/App.scss"

interface LoginFormProps {
    onLogin: (phoneNumber: string, firstName: string) => void;
    error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
    const [phone, setPhone] = useState('');
    const [surname, setSurname] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLogin(true);
        try {
          onLogin(phone, surname);
          console.log('Login success:', phone);
        } finally {
          setIsLogin(false);
        }
        console.log('birthMonth:', surname, typeof surname);
      };

    return (
        <div className="Container">
            <h2>Login</h2>
            <form className='form' onSubmit={handleLogin}>
                <div className="formContent row row-sm">
                    <label className="formLabel col-sm col-form-label">Phone Number:</label>
                        <input type="text" inputMode="tel" className="inputBox" value={phone} placeholder='HK phone number'
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} pattern="\d{8}" required />
                </div>
                <div className="formContent row row-sm">
                    <label className="formLabel col-sm col-form-label">Birth Month:</label>
                        <input type="text" className="inputBox" value={surname} 
                            onChange={(e) => setSurname(e.target.value)} required />
                </div>
                <div className="formContent row row-sm">
                <button type="submit">Login{isLogin ?' loading...' : 'login success'}</button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

// Mock verifyIdentity function for demonstration purposes
const verifyIdentity = (phoneNumber: string, firstName: string) => {
    // Replace with actual verification logic
    return phoneNumber === '12345678' && firstName === 'John';
};

export default LoginForm;