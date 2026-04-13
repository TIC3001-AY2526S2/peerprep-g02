import React, { useEffect, useRef, useState } from "react";
import './CollaborationPage.css';
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";

function Coding({ onSubmitCode, ydoc, provider }) {
    const editorParentRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        // ydoc and provider from CollaborationPage
        if (!ydoc || !provider || !editorParentRef.current) return;

        // Destroy previous instance
        if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
        }

        const ytext = ydoc.getText("code");

        const state = EditorState.create({
            // Blank start
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
                    ".cm-scroller": { overflow: "auto" },
                    ".cm-content": { padding: "0.5rem" },
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
                    <div className="collab-buttons" onClick={onSubmitCode}>
                        Submit
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Coding;