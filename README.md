# Clinical Component Identifier

A tool for identifying reusable components in clinical trial documents using Claude Sonnet and few-shot prompting.

## Features

- **Claude Sonnet AI** - Uses Anthropic's Claude Sonnet model for high-quality analysis
- **18 Few-Shot Examples** - Pre-trained with clinical document examples
- **10 Component Types** - Comprehensive taxonomy for clinical documents
- **ICH E3 CSR Support** - Ready for Clinical Study Report analysis
- **Location Tracking** - Shows page number and section for each component
- **Copy Functionality** - One-click copy for any component
- **Export to JSON** - Download all components as JSON
- **Large File Support** - Processes files up to 50MB
- **No Truncation** - Analyzes entire documents without cutting content

## Component Types

1. **boilerplate** - Standard regulatory/compliance text
2. **definition** - Clinical terms, endpoints, criteria
3. **study_section** - Study methodology, design elements
4. **drug_info** - Investigational product information
5. **safety** - Adverse event reporting, dose modifications
6. **procedure** - Clinical/laboratory procedures
7. **csr_structure** - ICH E3 structural elements
8. **statistical** - Sample size, analysis plans
9. **regulatory_guidance** - ICH guidelines, submission requirements
10. **ethics** - IRB/IEC, informed consent, Declaration of Helsinki

## Prerequisites

- Python 3.10+
- Node.js 18+
- Anthropic API Key

## Setup

1. **Get your Anthropic API key** from https://console.anthropic.com/

2. **Edit the API key** in `backend/app.py` line 38:
   ```python
   ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "YOUR_API_KEY_HERE")
   ```

3. **Run setup** (one time):
   ```
   SETUP.bat
   ```

4. **Start the application**:
   ```
   START.bat
   ```

5. **Open browser** at http://localhost:3000

## Supported File Types

- PDF (up to 50MB)
- DOCX (up to 50MB)
- TXT (up to 50MB)

## How It Works

1. Upload a clinical document (PDF, DOCX, or TXT)
2. Click "Identify Components"
3. View identified components with:
   - Component type and confidence score
   - Page number and section location
   - Full text (expandable)
   - Reuse potential rating
4. Copy individual components or export all as JSON

## API Endpoints

- `GET /` - Health check
- `POST /api/identify` - Identify components from text
- `POST /api/upload` - Upload and analyze file
- `GET /api/taxonomy` - Get component taxonomy
- `GET /api/supported-formats` - Get supported file formats

## Technology Stack

- **Backend**: Flask, Anthropic Claude API
- **Frontend**: React, Vite
- **AI Model**: Claude Sonnet (claude-sonnet-4-20250514)

## License

MIT
