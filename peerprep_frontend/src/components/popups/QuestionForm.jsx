import { useEffect, useState } from 'react';
import { createQuestion, updateQuestion } from '../../api/QuestionApi';
import './questionForm.css';
import './loginSignup.css';

function QuestionForm({ handleCancelQuestion, question, topics, setQuestions, update }) {
    const [title, setTitle] = useState(question?.title || "");
    const [description, setDescription] = useState(question?.description || "");
    const [categories, setCategories] = useState(question?.categories || []);
    const [complexity, setComplexity] = useState(question?.complexity || "Easy");

    const handleTopicChange = (e) => {
        const value = e.target.value;

        if (e.target.checked) {
            setCategories([...categories, value]);
        } else {
            setCategories(
                categories.filter((topic) => topic !== value)
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const questionData = {
            title: title,
            description: description,
            categories: categories,
            complexity: complexity
        };

        try {
            if (update) {
                const response = await updateQuestion(question._id, questionData);
                console.log("Updated response:", response);
                alert("Question updated successfully!");
                questionData["_id"] = question._id;
                setQuestions(prevQuestions =>
                    prevQuestions.map(q =>
                        q._id === questionData._id ? questionData : q
                    )
                );
            } else {
                const response = await createQuestion(questionData);
                alert("Question created successfully!");
                setQuestions(prevQuestions => [...prevQuestions, response.question]);
            }
            handleCancelQuestion();
        } catch (error) {
            console.error("Error creating question:", error);
            alert("Failed to create question. See console for details.");
        }
    };

    return (
        <div className="popup-overlay" >
            <div className='question-form-container'>
                <div className='close-button' onClick={handleCancelQuestion}>&times;</div>
                <form className="question-form" onSubmit={handleSubmit}> {/* Added onSubmit */}
                    <div className='title-font'>Questions</div>
                    <div className='input-containers'>
                        <label>Title: </label>
                        <input type="text" placeholder="Question title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className='input-containers'>
                        <label>Description: </label>
                        <textarea type="text" placeholder="Question description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <label><span>Topics</span></label>
                        <div className="topics-container">
                            {topics.map((topic) => (
                                <label key={topic} className="topic-item">
                                    <input
                                        type="checkbox"
                                        value={topic}
                                        checked={categories?.includes(topic)}
                                        onChange={handleTopicChange}
                                    />
                                    <span>{topic}</span>
                                </label>
                            ))}
                        </div>

                    </div>
                    <div className="input-containers">
                        <label>Complexity: </label>
                        <div className="dropdown">
                            <select
                                className="question-dropdown-button dropdown-select"
                                value={complexity}
                                onChange={(e) => setComplexity(e.target.value)}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit">{update ? "Update" : "Create"}</button>
                </form>
            </div>
        </div>
    )
}

export default QuestionForm;