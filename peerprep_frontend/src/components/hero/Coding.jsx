import React, { useEffect, useRef, useState } from "react";
import './CollaborationPage.css';
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import { run } from "../../api/CollabApi";

function Coding({ onSubmitCode, ydoc, provider, skeleton }) {
    const editorParentRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        if (!ydoc || !provider || !editorParentRef.current) return;

        if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
        }

        const ytext = ydoc.getText("code");

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

    console.log("skeleton:", skeleton);

    const onRunCode = async () => {
        console.log("waiting");
        const response = await run("def reverseString(s):\n    s.reverse()\n", "o l l e h", "h e l l o");
        if (response) {
            console.log(response);
        }
    }

    return (
        <div className="collab-containers code">

            <div className="collabBox code" ref={editorParentRef} />

            <div className="collabBox terminal">
                <div className="table-container">
                    <table id="test-case-table">
                        <thead>
                            <tr>
                                <th>Expression</th>
                                <th>Expected</th>
                                <th>Output</th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                            <tr className="test-pass">
                                <td>mid_point of (1.0, 1.0) and (3.0, 3.0)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td>(2.000000, 2.000000)</td>
                            </tr>
                            <tr className="test-fail">
                                <td>mid_point of (1.0, 1.0) and (3.0, 3.0)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td>(2.000000, 2.000000)</td>
                            </tr>
                            <tr className="test-fail">
                                <td>mid_point of (1.0, 1.0) and (3.0, 3.0)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td>(2.000000, 2.000000)</td>
                            </tr>
                            <tr className="test-fail">
                                <td>mid_point of (1.0, 1.0) and (3.0, 3.0)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td>(2.000000, 2.000000)</td>
                            </tr>
                            <tr className="test-fail">
                                <td>mid_point of (1.0, 1.0) and (3.0, 3.0)</td>
                                <td>(2.000000, 2.000000)</td>
                                <td>(2.000000, 2.000000)</td>
                            </tr>
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