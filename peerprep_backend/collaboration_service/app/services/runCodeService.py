import requests
import asyncio

JUDGE0_URL = "https://ce.judge0.com/submissions?wait=true"

SAMPLE_QUESTION = {
    "run_code": {
        "python": "import sys\narr = list(map(int, sys.stdin.read().strip().split()))\nreverseString(arr)\nprint(' '.join(arr))"
    },
    "input": ["h e l l o"],
    "expected_output": ["o l l e h"],
}

LANGUAGE_IDS = {
    "python": 71,
    "javascript": 63,  # Judge0 language ID for Node.js
    # Add more languages here if needed
}


class RunCodeService:
    def __init__(self, question):
        self.question = question
        # Get the code for the specified language
        run_code_field = question.get("run_code", {})
        self.language = list(run_code_field.keys())[0].lower()
        self.language_id = LANGUAGE_IDS.get(self.language)

        self.source_code = run_code_field[self.language]
        if not self.language_id:
            raise ValueError(f"No Judge0 language ID found for '{self.language}'")

        self.stdin = "\n".join(question.get("input", []))

    async def run(self, user_code):
        payload = {
            "language_id": self.language_id,
            "source_code": user_code+self.source_code,
            "stdin": self.stdin
            }
        headers = {
            "Content-Type": "application/json",
        }

        retries = 5
        for retry in range(retries):
            response = requests.post(JUDGE0_URL, headers=headers, json=payload)

            if response.status_code in (200, 201):
                result = response.json()
                return {
                    "stdout": result.get("stdout", ""),
                    "stderr": result.get("stderr", ""),
                    "compile_output": result.get("compile_output", ""),
                }
            elif response.status_code in (429):
                await asyncio.sleep(2**retry) #1 second, try again
            else:
                return {"error": f"{response.status_code} - {response.text}"}
        return {"error": "429 - Server busy"}
    
    def check_output(self, output):
        return output.strip() == self.question.get("expected_output")
