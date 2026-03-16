#!/bin/bash
# Run the user study locally. MUST run from project root (cs490/).
cd "$(dirname "$0")/.."
echo "Serving from: $(pwd)"
echo "Open: http://localhost:8000/study/"
echo ""
python3 -m http.server 8000
