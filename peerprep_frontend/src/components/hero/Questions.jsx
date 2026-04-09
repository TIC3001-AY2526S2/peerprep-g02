import './Questions.css';
import { getQuestions, deleteQuestion } from '../../api/QuestionApi';
import { useEffect } from 'react';
import { useUser } from '../../context/UserContext';

function Questions({ ...questionArgs }) {
    const { setShowQuestionForm, setSelectedQuestion, setQuestions, questions, setUpdate } = questionArgs;
    const { user } = useUser();

    const get_questions = async () => {
        const availableQuestions = await getQuestions();
        setQuestions(availableQuestions);
    }

    const handleShowQuestionForm = () => {
        setShowQuestionForm((prev) => !prev);
        setUpdate(false);
        setSelectedQuestion({})
    }

    const handleDeleteQuestion = async (id) => {
        // console.log("Deleting question with ID:", id); // Add this line
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await deleteQuestion(id);
                alert("Question deleted successfully!");
                setQuestions(prevQuestions =>
                    prevQuestions.filter(q => q._id !== id)
                );
            } catch (error) {
                console.error("Error deleting question:", error);
                alert("Failed to delete question. See console for details.");
            }
        }
    };

    useEffect(() => {
        get_questions();
        console.log(user);
    }, []);

    return (
        <div className='question-container'>
            {user?.role == "admin"?
            <div className='question-button-group'>
                
                <div className='button' onClick={handleShowQuestionForm}>Add Question</div>
            </div>:<></>}
            <table className="question-table">
                <thead>
                    <tr>
                        {user?.role == "user"?
                            <th>Status</th> : <></>}
                        <th>#</th>
                        <th>Question</th>
                        <th>Topic</th>
                        <th>Difficulty</th>
                        {user?.role == "admin"?
                            <>
                                <th>Edit</th>
                                <th>Delete</th>
                            </> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {questions?.map((q, index) => (
                        <tr key={q?._id}>
                            {user?.role == "user"? (<td className="status-cell">
                                {q.attempted ? (
                                    <span className="tick">✓</span>
                                ) : (
                                    <span className="no-tick">—</span>
                                )}
                            </td>) : <></>}
                            <td>{index + 1}</td>
                            <td className="question-name">{q?.title}</td>
                            <td>{q?.categories.join(', ')}</td>
                            <td>
                                <span className={`difficulty ${(q?.complexity).toLowerCase()}`}>
                                    {q?.complexity}
                                </span>
                            </td>
                            {user?.role == "admin"?
                                <><td><div className='button' onClick={() => { setShowQuestionForm(true); setSelectedQuestion(q); setUpdate(true) }}>Edit</div></td>
                                    <td><div className='button' onClick={() => handleDeleteQuestion(q._id)}>Delete</div></td></> : <></>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Questions;