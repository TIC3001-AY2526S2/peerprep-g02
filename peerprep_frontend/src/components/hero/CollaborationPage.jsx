import React, { useState } from "react";
import Chat from "./Chat";
import Coding from "./Coding";
import CodingQuestion from "./CodingQuestion";
import './CollaborationPage.css';
import ReviewStats from "../hero/popups/ReviewStats";

function CollaborationPage({ onExitCollab }) {
    const [showReviewStats, setShowReviewStats] = useState(false);

    return (
        <>
            <div className="collaboration-main-container">
                <CodingQuestion />
                <Coding onSubmitCode={() => setShowReviewStats(true)} />
                <Chat />
            </div>

            {showReviewStats && (
                <ReviewStats onExitCollab={onExitCollab} />
            )}
        </>
    );
}

export default CollaborationPage;