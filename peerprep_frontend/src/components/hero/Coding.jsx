import React, { useEffect, useRef, useState } from "react";
import './CollaborationPage.css';
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import { run } from "../../api/CollabApi";

function Coding({ onSubmitCode, ydoc, provider, skeleton }) {
    const editorParentRef = useRef(null);
    const viewRef = useRef(null);
    const ytextRef = useRef(null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!ydoc || !provider || !editorParentRef.current) return;

        if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
        }

        const ytext = ydoc.getText("code");
        ytextRef.current = ytext;

        const insertSkeleton = () => {
            if (ytext.length === 0 && skeleton) {
                ytext.insert(0, skeleton);
            }
        };

        // Try sync
        if (provider.synced) {
            insertSkeleton();
        } else {
            provider.once("sync", insertSkeleton);

            // If sync never happens
            setTimeout(() => {
                if (ytext.length === 0) {
                    insertSkeleton();
                }
            }, 1000);
        }

        const state = EditorState.create({
            doc: "",
            extensions: [
                basicSetup,
                python(),
                indentUnit.of("    "), // 4 spaces
                yCollab(ytext, provider.awareness),
                EditorView.theme({
                    "&": {
                        backgroundColor: "#F5F5F5",
                        height: "100%",
                        fontSize: "14px",
                        fontFamily: "monospace",
                    },
                    ".cm-scroller": { overflow: "auto" },
                    ".cm-content": { padding: "0.5rem" },
                    ".cm-gutters": {
                        backgroundColor: "#ebebeb",
                        borderRight: "2px solid #1E1E1E",
                        color: "#888",
                    },
                }),
            ],
        });

        viewRef.current = new EditorView({
            state,
            parent: editorParentRef.current,
        });

        const handleSync = () => insertSkeleton();
        provider.once("sync", handleSync);

        if (provider.synced) insertSkeleton();

        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [ydoc, provider, skeleton]);

    const onRunCode = async () => {
        const question = JSON.parse(localStorage.getItem("question"))
        const inputs = question?.input;
        const expected = question?.expected_output;
        const userCode = ytextRef.current.toString();
        const newResults = []
        for (let i=0;i<inputs.length;i++ ) {
            const response = await run(userCode, inputs[i], expected[i]);
            if (response) {
                const result = {
                    "input": inputs[i],
                    "expected_output": expected[i],
                    "pass": response["resultPassed"]
                }
                newResults.push(result)
            }
        }
        setResults(prev => [...prev, ...newResults]);
    }

    return (
        <div className="collab-containers code">

            <div className="collabBox code" ref={editorParentRef} />

            <div className="collabBox terminal">
                <div className="table-container">
                    <table id="test-case-table">
                        <thead>
                            <tr>
                                {/* <th>Expression</th> */}
                                <th>Input</th>
                                <th>Expected</th>
                                {/* <th>Output</th> */}
                                <th>Pass/Fail</th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                            {results.map((result, index) => {
                                return result.pass === true ?
                                    <tr key={index} className="test-pass">
                                        <td>{result["input"]}</td>
                                        <td>{result["expected_output"]}</td>
                                        <td>Passed</td>
                                    </tr> :
                                    <tr key={index} className="test-fail">
                                        <td>{result["input"]}</td>
                                        <td>{result["expected_output"]}</td>
                                        <td>Failed</td>
                                    </tr>
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="button-wrapper">
                    <div className="collab-buttons" onClick={onRunCode}>Run</div>
                    <div className="collab-buttons" onClick={onSubmitCode}>
                        Submit
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Coding;