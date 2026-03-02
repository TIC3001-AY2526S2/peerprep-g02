import './Questions.css';

function Questions() {
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
    );
}

export default Questions;