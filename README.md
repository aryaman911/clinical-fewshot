# Clinical Component Identifier - Few-Shot Version

AI-powered extraction of reusable clinical document components using OpenAI GPT-4o-mini with few-shot prompting.

**Now supports PDF, DOCX, and TXT file uploads!**
**NEW: ICH E3 Clinical Study Report (CSR) template support!**

## Overview

This tool identifies and extracts reusable components from clinical trial documents such as:
- **Boilerplate**: Standard regulatory/compliance text (GCP statements, confidentiality clauses)
- **Definitions**: Endpoint definitions, AE/SAE definitions, terminology
- **Study Sections**: Inclusion/exclusion criteria, objectives, methodology, patient disposition
- **Drug Info**: Mechanism of action, dosing, pharmacokinetics
- **Safety**: Adverse event reporting, dose modifications, risk mitigation, extent of exposure
- **Procedures**: Sample collection, visit schedules, assessments
- **CSR Structure**: ICH E3 structural elements, title page requirements, synopsis format
- **Statistical**: Sample size determination, statistical analysis plans, missing data handling
- **Regulatory Guidance**: ICH guidelines, submission requirements, abbreviated report guidance
- **Ethics**: IRB/IEC requirements, informed consent procedures, Declaration of Helsinki compliance

## Features

- **Few-Shot Prompting**: Uses 18 labeled examples from real clinical trials and ICH E3 guidelines
- **ICH E3 CSR Support**: Optimized for Clinical Study Report templates
- **Expected Accuracy**: 85-95%
- **Model**: OpenAI GPT-4o-mini (cost-effective)
- **Modern UI**: React + Vite frontend
- **Improved PDF Extraction**: Better handling of regulatory documents with complex formatting

## Quick Start (Windows)

### Prerequisites
1. **Python 3.10+**: Download from https://python.org (check "Add to PATH")
2. **Node.js 18+**: Download from https://nodejs.org
3. **OpenAI API Key**: Get from https://platform.openai.com/api-keys

### Installation

1. **Download and extract** the project to `C:\clinical-fewshot\`

2. **Set your API Key** - Edit `backend\app.py` line 19:
   ```python
   OPENAI_API_KEY = "sk-proj-your-actual-key-here"
   ```

3. **Setup Backend** - Open Command Prompt:
   ```cmd
   cd C:\clinical-fewshot\backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Setup Frontend** - Open another Command Prompt:
   ```cmd
   cd C:\clinical-fewshot\frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Backend:**
```cmd
cd C:\clinical-fewshot\backend
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```cmd
cd C:\clinical-fewshot\frontend
npm run dev
```

**Open browser**: http://localhost:3000

## Project Structure

```
clinical-fewshot/
├── backend/
│   ├── app.py              # Flask API with few-shot prompting
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Styles
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── setup-windows.bat       # Automated setup script
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/identify` | POST | Identify components in text |
| `/api/upload` | POST | Upload PDF/DOCX/TXT file |
| `/api/taxonomy` | GET | Get component type definitions |
| `/api/examples` | GET | Get few-shot examples |
| `/api/supported-formats` | GET | Get supported file formats |

### Example API Call - Text

```bash
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"text": "This study will be conducted in accordance with GCP..."}'
```

### Example API Call - File Upload

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@protocol.pdf"
```

## Few-Shot Examples

The model is trained with 18 labeled examples from real clinical trials (Niraparib Protocol PR-30-5015-C) and ICH E3 CSR guidelines:

### Clinical Trial Protocol Examples
1. **GCP Compliance Statement** (boilerplate)
2. **Overall Survival Definition** (definition)
3. **Inclusion Criteria** (study_section)
4. **Drug Mechanism of Action** (drug_info)
5. **Dose Modification for Toxicity** (safety)
6. **PK Blood Sampling Schedule** (procedure)
7. **Adverse Event Definition** (definition)
8. **Primary Study Objective** (study_section)

### ICH E3 CSR Template Examples
9. **CSR Title Page Requirements** (csr_structure)
10. **CSR Synopsis Requirements** (csr_structure)
11. **Declaration of Helsinki Compliance** (ethics)
12. **Informed Consent Documentation** (ethics)
13. **Serious Adverse Event Definition** (definition)
14. **Sample Size Determination** (statistical)
15. **Patient Disposition Requirements** (study_section)
16. **Extent of Exposure Requirements** (safety)
17. **Abbreviated Report Guidance** (regulatory_guidance)
18. **Data Listing Requirements** (regulatory_guidance)

## Sample Data

The `sample_data/` folder includes:
- `CSR_Template.pdf` - ICH E3 Clinical Study Report template (49 pages)
- `2014-002011-41_-protocol-GSK.pdf` - Sample clinical trial protocol
- `2014-002011-41-GSK_SAP.pdf` - Sample Statistical Analysis Plan
- `LLM_Component_Identification_Guide.docx` - Component identification guide

## Configuration

### API Key Setup Options

**Option 1 - Direct Edit** (recommended for testing):
Edit `backend/app.py` line 19:
```python
OPENAI_API_KEY = "sk-proj-your-key-here"
```

**Option 2 - Environment Variable**:
```cmd
set OPENAI_API_KEY=sk-proj-your-key-here
python app.py
```

### Estimated Costs

- **Model**: GPT-4o-mini
- **Cost per analysis**: ~$0.001-0.002 (depends on text length)
- **1000 analyses**: ~$1-2

## Troubleshooting

### "Python is not recognized"
- Reinstall Python and check "Add Python to PATH"
- Or use full path: `C:\Python311\python.exe`

### "npm is not recognized"
- Reinstall Node.js
- Restart Command Prompt

### "OpenAI API Error"
- Verify API key is correct
- Check you have credits at https://platform.openai.com/usage
- Ensure no extra spaces in the key

### CORS Error
- Make sure backend is running on port 5000
- Check Flask-CORS is installed

### Port Already in Use
```cmd
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <pid> /F
```

## License

MIT License - Free for commercial and personal use.
