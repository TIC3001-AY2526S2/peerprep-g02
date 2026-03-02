import './Questions.css';
import { getQuestions } from '../../api/QuestionApi';
import { useEffect, useState } from 'react';

function Questions() {
    const [questions, setQuestions] = useState([]);

    const get_questions = async() =>{
        const availableQuestions = await getQuestions();
        setQuestions(availableQuestions);
    }

    useEffect(()=>{
        get_questions();
    },[]);
    return (
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
                {questions.map((q, index) => (
                    <tr key={q._id}>
                        <td className="status-cell">
                            {q.attempted ? (
                                <span className="tick">✓</span>
                            ) : (
                                <span className="no-tick">—</span>
                            )}
                        </td>
                        <td>{index+1}</td>
                        <td className="question-name">{q.title}</td>
                        <td>{q.category}</td>
                        <td>
                            <span className={`difficulty ${(q.complexity).toLowerCase()}`}>
                                {q.complexity}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Questions;