import { useEffect, useState } from 'react';
import { loginUser } from '../../../api/UserApi';
import { useUser } from '../../../context/UserContext';
import './questionForm.css'

function QuestionForm({ handleCancelQuestion, question, topics }) {
    const [title, setTitle] = useState(question?.title);
    const [description, setDescription] = useState(question?.description);
    const [categories, setCategories] = useState(question?.categories)
    const [complexity, setComplexity] = useState(question?.complexity)
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

    return (
        <div className='question-form-container'>
            <form className="forgot-password-form">
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
                            <div>
                                <input
                                    key={topic}
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