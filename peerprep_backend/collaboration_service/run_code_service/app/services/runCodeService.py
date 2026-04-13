import asyncio
from typing import Any, Dict, List, Optional

import requests

JUDGE0_URL = "https://ce.judge0.com/submissions?wait=true"

LANGUAGE_IDS = {
    "python": 71,
    "javascript": 63,
}

DEFAULT_TIMEOUT = 15


class RunCodeService:
    def __init__(self, question: Dict[str, Any]):
        if not isinstance(question, dict):
            raise ValueError("Question must be a dictionary.")

        self.question = question
        self.language = self._extract_language()
        self.language_id = self._get_language_id()
        self.hidden_runner_code = self._extract_hidden_runner_code()
        self.inputs = self._extract_inputs()
        self.expected_outputs = self._extract_expected_outputs()

    def _extract_language(self) -> str:
        run_code = self.question.get("run_code", {})

        if not isinstance(run_code, dict) or not run_code:
            raise ValueError("Question must contain a non-empty 'run_code' dictionary.")

        return next(iter(run_code.keys())).strip().lower()

    def _get_language_id(self) -> int:
        language_id = LANGUAGE_IDS.get(self.language)
        if language_id is None:
            raise ValueError(f"Unsupported language: {self.language}")
        return language_id

    def _extract_hidden_runner_code(self) -> str:
        run_code = self.question.get("run_code", {})
        hidden_code = run_code.get(self.language)

        if not isinstance(hidden_code, str) or not hidden_code.strip():
            raise ValueError(f"Missing runner code for language '{self.language}'.")

        return hidden_code

    def _extract_inputs(self) -> List[str]:
        inputs = self.question.get("input", [])
        if inputs is None:
            return []

        if not isinstance(inputs, list):
            raise ValueError("'input' must be a list.")

        return [str(item) for item in inputs]

    def _extract_expected_outputs(self) -> List[str]:
        outputs = self.question.get("expected_output", [])
        if outputs is None:
            return []

        if not isinstance(outputs, list):
            raise ValueError("'expected_output' must be a list.")

        return [str(item) for item in outputs]

    def _normalize_output(self, output: Optional[str]) -> str:
        if output is None:
            return ""
        return output.replace("\r\n", "\n").strip()

    def _build_source_code(self, user_code: str) -> str:
        cleaned_user_code = (user_code or "").rstrip()
        cleaned_runner_code = self.hidden_runner_code.lstrip()
        return f"{cleaned_user_code}\n\n{cleaned_runner_code}"

    def _build_payload(self, source_code: str, stdin: str) -> Dict[str, Any]:
        return {
            "language_id": self.language_id,
            "source_code": source_code,
            "stdin": stdin,
        }

    def _post_to_judge0(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        headers = {
            "Content-Type": "application/json",
        }

        response = requests.post(
            JUDGE0_URL,
            headers=headers,
            json=payload,
            timeout=DEFAULT_TIMEOUT,
        )

        if response.status_code not in (200, 201):
            raise RuntimeError(f"{response.status_code} - {response.text}")

        return response.json()

    async def _run_single_test(self, source_code: str, stdin: str) -> Dict[str, Any]:
        payload = self._build_payload(source_code, stdin)

        retries = 5
        for attempt in range(retries):
            try:
                return await asyncio.to_thread(self._post_to_judge0, payload)
            except requests.exceptions.Timeout:
                if attempt == retries - 1:
                    return {"error": "Judge0 request timed out."}
            except requests.exceptions.RequestException as e:
                if attempt == retries - 1:
                    return {"error": f"Network error: {str(e)}"}
            except RuntimeError as e:
                message = str(e)

                if message.startswith("429"):
                    if attempt < retries - 1:
                        await asyncio.sleep(2 ** attempt)
                        continue
                    return {"error": "429 - Server busy"}

                return {"error": message}
            except Exception as e:
                return {"error": str(e)}

        return {"error": "Unknown execution error."}

    def _extract_actual_output(self, result: Dict[str, Any]) -> str:
        stdout = self._normalize_output(result.get("stdout"))
        stderr = self._normalize_output(result.get("stderr"))
        compile_output = self._normalize_output(result.get("compile_output"))
        error = self._normalize_output(result.get("error"))

        if stdout:
            return stdout
        if stderr:
            return stderr
        if compile_output:
            return compile_output
        if error:
            return error
        return ""

    def _format_result(
        self,
        index: int,
        stdin: str,
        expected: str,
        execution_result: Dict[str, Any],
    ) -> Dict[str, Any]:
        normalized_expected = self._normalize_output(expected)
        actual_output = self._extract_actual_output(execution_result)

        return {
            "test_case": index + 1,
            "expression": f"Test Case {index + 1}",
            "input": stdin,
            "expected": normalized_expected,
            "output": actual_output,
            "passed": actual_output == normalized_expected,
            "stdout": self._normalize_output(execution_result.get("stdout")),
            "stderr": self._normalize_output(execution_result.get("stderr")),
            "compile_output": self._normalize_output(execution_result.get("compile_output")),
            "error": self._normalize_output(execution_result.get("error")),
        }

    async def run(self, user_code: str) -> Dict[str, Any]:
        if not isinstance(user_code, str) or not user_code.strip():
            return {
                "language": self.language,
                "results": [],
                "summary": {
                    "total": 0,
                    "passed": 0,
                    "failed": 0,
                },
                "error": "User code cannot be empty.",
            }

        test_inputs = self.inputs if self.inputs else [""]
        expected_outputs = self.expected_outputs if self.expected_outputs else [""] * len(test_inputs)

        if len(expected_outputs) != len(test_inputs):
            return {
                "language": self.language,
                "results": [],
                "summary": {
                    "total": 0,
                    "passed": 0,
                    "failed": 0,
                },
                "error": "The number of inputs does not match the number of expected outputs.",
            }

        source_code = self._build_source_code(user_code)
        results = []

        for index, stdin in enumerate(test_inputs):
            execution_result = await self._run_single_test(source_code, stdin)
            formatted_result = self._format_result(
                index=index,
                stdin=stdin,
                expected=expected_outputs[index],
                execution_result=execution_result,
            )
            results.append(formatted_result)

        passed_count = sum(1 for result in results if result["passed"])
        total_count = len(results)

        return {
            "language": self.language,
            "results": results,
            "summary": {
                "total": total_count,
                "passed": passed_count,
                "failed": total_count - passed_count,
            },
        }