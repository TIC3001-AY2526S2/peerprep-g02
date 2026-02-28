import React, { useState } from "react";
import './Questions.css';
import Header from '../components/header/Header'
import Footer from "../components/footer/Footer";

function Questions() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const questions = [
        {
            id: 1,
            name: "Two Sum",
            topic: "Arrays",
            difficulty: "Easy",
            attempted: true,
        },
        {
            id: 2,
            name: "Longest Substring Without Repeating Characters",
            topic: "Sliding Window",
            difficulty: "Medium",
            attempted: false,
        },
        {
            id: 3,
            name: "Merge k Sorted Lists",
            topic: "Linked List",
            difficulty: "Hard",
            attempted: true,
        },
    ];
    return (
        <div className='background-container'>

            <Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
            <div className="hero-section-wrapper">
                <table className="question-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>#</th>
                            <th>Question</th>
                            <th>Topic</th>
                            <th>Difficulty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td className="status-cell">
                                    {q.attempted ? (
                                        <span className="tick">✓</span>
                                    ) : (
                                        <span className="no-tick">—</span>
                                    )}
                                </td>
                                <td>{q.id}</td>
                                <td className="question-name">{q.name}</td>
                                <td>{q.topic}</td>
                                <td>
                                    <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                                        {q.difficulty}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Footer />
        </div>
    );
}

export default Questions;