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

# Env 
- Required ENV settings:
    - OPEN_AI_KEY="<YOUR_API_KEY>"
    - POSTGRES_ENDPOINT="<POSTGRES_ENDPOINT>"
    - POSTGRES_USERNAME="<POSTGRES_USERNAME>"
    - POSTGRES_PASSWORD="<POSTGRES_PASSWORD>"
    - POSTGRES_PORT="<POSTGRES_PORT>"
    - POSTGRES_NAME="<POSTGRES_NAME>"

# Data Ingestion Sample
To run the data ingestion sample route, add the following folder(s) to the src folder:
- ".files/bargaining"

Go to [Hawaii Bargainaing Documents](https://dhrd.hawaii.gov/state-hr-professionals/lro/public-emp-excl-reps/), download any of the PDFs and add it to the bargaining files folder. 

Now run the `/ingestion` route! Outputs will (for now) be shown in the `.files/bargaining/llm_outputs` folder for viewing. TODO: Move to postgres db with a UUID.