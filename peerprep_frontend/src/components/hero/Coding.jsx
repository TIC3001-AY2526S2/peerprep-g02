import React, { useEffect, useState } from "react";
import sampleCode from '../../assets/text/sampleCode.txt';
import './CollaborationPage.css';

function Coding({ onSubmitCode }) {
    const [codeText, setCodeText] = useState("");

    useEffect(() => {
        fetch(sampleCode)
            .then(res => res.text())
            .then(text => setCodeText(text));
    }, []);

    const submitCode = () => {
        onSubmitCode();
    };

    return (
        <div className="collab-containers code">
            <div className="collabBox code">
                <pre>{codeText}</pre>
            </div>

            <div className="collabBox terminal">
                <div className="table-container">
                    <table id="test-case-table">
                        <thead>
                            <tr>
                                <th>Expression</th>
                                <th>Expected</th>
                                <th>Output</th>
                                <th>Pass?</th>
                            </tr>
                        </thead>

                        <tbody id="table-body">
                            <tr>
                                <td>mid_point of (1.0, 1.0) and (3.0, 3.0)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td className="status-cell">
                                    <span className="tick">✓</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="button-wrapper">
                    <div className="collab-buttons">Run</div>
                    <div className="collab-buttons" onClick={submitCode}>
                        Submit
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Coding;