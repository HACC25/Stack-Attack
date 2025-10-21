# Install Poetry 
    - Go to: https://python-poetry.org/docs/#installing-with-the-official-installer
        - Follow installation steps
    - Run `poetry --version` on a new powershell instance to confirm successful installation
        - Restarting VSC may be required
    - Set poetry config to in-project venv: `poetry config virtualenvs.in-project true`
    - Create venv and install packages with `poetry install` or with `python -m venv .venv`
        - Activate poetry shell: `poetry env activate`

# Starting Server
    - poetry run uvicorn src.app:app --host 0.0.0.0 --port 8000
    - Testing routes: 
        - Go to: http://localhost:8000/docs
        - Run test routes through that page 

# Formatter
    - Run: `poetry run black src/` to format all files automatically