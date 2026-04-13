import React, { useEffect, useRef, useState } from "react";
import "./CollaborationPage.css";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";

function Coding({ onSubmitCode, ydoc, provider, questionId }) {
    const editorParentRef = useRef(null);
    const viewRef = useRef(null);

    const [runResults, setRunResults] = useState([]);
    const [runSummary, setRunSummary] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [runError, setRunError] = useState("");

    useEffect(() => {
        if (!ydoc || !provider || !editorParentRef.current) return;

        if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
        }

        const ytext = ydoc.getText("code");

        const state = EditorState.create({
            doc: ytext.toString(),
            extensions: [
                basicSetup,
                python(),
                yCollab(ytext, provider.awareness),
                EditorView.theme({
                    "&": {
                        backgroundColor: "#F5F5F5",
                        height: "100%",
                        fontSize: "14px",
                        fontFamily: "monospace",
                    },
                    ".cm-scroller": {
                        overflow: "auto",
                    },
                    ".cm-content": {
                        padding: "0.5rem",
                    },
                    ".cm-gutters": {
                        backgroundColor: "#ebebeb",
                        borderRight: "2px solid #1E1E1E",
                        color: "#888",
                    },
                    ".cm-ySelectionInfo": {
                        fontSize: "11px",
                        padding: "1px 4px",
                        borderRadius: "3px",
                        opacity: "0.9",
                    },
                }),
            ],
        });

        viewRef.current = new EditorView({
            state,
            parent: editorParentRef.current,
        });

        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [ydoc, provider]);

    const handleRunCode = async () => {
        try {
            setIsRunning(true);
            setRunError("");
            setRunResults([]);
            setRunSummary(null);

            const userCode = viewRef.current?.state.doc.toString() || "";

            if (!userCode.trim()) {
                setRunError("Code editor is empty.");
                return;
            }

            if (!questionId) {
                setRunError("Missing question ID.");
                return;
            }

            const response = await fetch("http://localhost:8000/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_code: userCode,
                    question_id: questionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.error || "Failed to run code");
            }

            setRunResults(data.results || []);
            setRunSummary(data.summary || null);

            if (data.error) {
                setRunError(data.error);
            }
        } catch (error) {
            setRunError(error.message || "Failed to run code");
        } finally {
            setIsRunning(false);
        }
    };

    console.log("Question ID:", questionId);

    return (
        <div className="collab-containers code">
            <div className="collabBox code" ref={editorParentRef} />

            <div className="collabBox terminal">
                {runError && (
                    <div style={{ color: "red", padding: "0.5rem" }}>
                        {runError}
                    </div>
                )}

                {runSummary && (
                    <div style={{ padding: "0.5rem", fontWeight: "bold" }}>
                        Passed {runSummary.passed} / {runSummary.total}
                    </div>
                )}

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
                            {runResults.length > 0 ? (
                                runResults.map((result) => (
                                    <tr key={result.test_case}>
                                        <td>{result.expression}</td>
                                        <td>{result.expected}</td>
                                        <td>{result.output}</td>
                                        <td className="status-cell">
                                            <span className={result.passed ? "tick" : "no-tick"}>
                                                {result.passed ? "✓" : "✗"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>
                                        No run results yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="button-wrapper">
                    <div className="collab-buttons" onClick={handleRunCode}>
                        {isRunning ? "Running..." : "Run"}
                    </div>

                    <div className="collab-buttons" onClick={onSubmitCode}>
                        Submit
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Coding;