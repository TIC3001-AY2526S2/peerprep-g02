function ForgotPassword({handleCancel}) {

    const resetPassword = (e) => {
        e.preventDefault();
        console.log("Reset Password");
    }

    return (
        <form className='login-signup-form' onSubmit={resetPassword}>
            <h2>Forgot Password</h2>
            <p>Enter your PeerPrep registered email.</p>
            <input type="email" placeholder="Email" required/>
            <button type="submit">Send Reset Link</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default ForgotPassword;