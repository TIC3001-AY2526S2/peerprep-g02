function Waiting({ otherSubmitted }) {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h2>Waiting...</h2>
                <p>
                    {otherSubmitted
                        ? "Your partner has submitted too. Finishing up..."
                        : "Waiting for the other user to submit."}
                </p>
            </div>
        </div>
    );
}

export default Waiting;