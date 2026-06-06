# Notes on testing the API
To test the API, first setup the environment:
## One-time setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install schemathesis
```

## Running the tests
```bash
npm run test:all
# or just the schemathesis tests
npm run test:fuzz
```
