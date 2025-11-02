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

Now run the `/ingestion` route! The outputs will be stored in the documents table in PostgreSQL.

# Postgresql

## AWS RDS
- Create an RDS PostgreSQL instance
    - Store the instance name, endpoint, port, username, and password in an ENV file.
        - See env.sample 
- To allow connections locallay or on an external IP, go to the AWS portal > EC2
    - Find the default security option and click it
    - Navigate to inbound rules and select "Edit inbound rules"
    - Add a new rule of type "PostgreSQL" then select the source "My IP"


## Injestion 

`/ingestion_demo` route takes a lengthly amount of time. Depending on the amount of documents to index, this process may take upwards of 15 minutes.
DO NOT run this process unless you want to re-index the entire bargaining document repository. 

TODO: Make a background process and a tracker to avoid API interuptions. 
TODO: Avoid un-needed upserts.
    - Make an update folder to avoid upserting the same file more than once
    - OR ignore the same file names unless explicitly stated

# AUTH

Using Google OAUTH for authenticating users. 
On successful Authentification, users are redirected back to the frontend home page `/auth/callback`.
Store credentials on that page as needed.

Newer routes are now secured using a custom JWT derived from the Google auth access token.
If the token does not match a user within our database, return error 403 (forbidden error).
If the token cannot be decoded using the secret token, return error 401 (auth error).

IMPORTANT: We do not store any email passwords, nor do we read any of these values. Your privacy is of utmost importance.

TODO: Establish allow domains
