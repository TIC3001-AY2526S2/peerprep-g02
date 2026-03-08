import { useEffect, useState } from 'react';
import { createQuestion, updateQuestion } from '../../../api/QuestionApi';
import { useUser } from '../../../context/UserContext';
import './questionForm.css';

function QuestionForm({ handleCancelQuestion, question, topics, get_questions }) {
    const [title, setTitle] = useState(question?.title || "");
    const [description, setDescription] = useState(question?.description || "");
    const [categories, setCategories] = useState(question?.categories || []);
    const [complexity, setComplexity] = useState(question?.complexity || "Easy");

    let update = false;
    if (question) {
        update = true;
    }

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

        console.log("Creating question with data:", questionData);

        try {
            const response = await createQuestion(questionData);
            console.log("Create response:", response);
            alert("Question created successfully!");
            handleCancelQuestion();
            get_questions();
        } catch (error) {
            console.error("Error creating question:", error);
            alert("Failed to create question. See console for details.");
        } finally {
            console.log("This request finished")
        }
    };

    return (
        <div className='question-form-container'>
            <form className="forgot-password-form" onSubmit={handleSubmit}> {/* Added onSubmit */}
                <p>Questions</p>
                <div>
                    <label>Title: </label>
                    <input type="text" placeholder="Question title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Description: </label>
                    <textarea type="text" placeholder="Question description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label><span>Topics</span></label>
                    <div className='topics-container'>

                        {topics.map((topic) => (
                            <div key={topic}> {/* Added key for React list */}
                                <input
                                    type="checkbox"
                                    value={topic}
                                    checked={categories?.includes(topic)}
                                    onChange={handleTopicChange}
                                />
                                <label>{topic}</label>
                            </div>
                        ))}
                    </div>

                </div>
                <div>
                    <label>Complexity: </label>
                    <select value={complexity} onChange={(e) => setComplexity(e.target.value)} placeholder="Question complexity">
                        <option value={"Easy"}>
                            Easy
                        </option>
                        <option value={"Medium"}>Medium</option>
                        <option value={"Hard"}>Hard</option>
                    </select>
                </div>
                <button type="submit">{update ? "Update" : "Create"}</button>
                <button type="button" onClick={handleCancelQuestion}>Cancel</button>
            </form>
        </div>
    )
}

export default QuestionForm;