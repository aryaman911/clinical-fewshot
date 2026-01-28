import { useState, useRef } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000'

// Sample clinical texts for testing
const SAMPLE_TEXTS = [
  {
    title: "Protocol Synopsis",
    text: `This is a Phase 3, randomized, double-blind, placebo-controlled, multicenter study to evaluate the efficacy and safety of Drug XYZ-500 in patients with advanced non-small cell lung cancer (NSCLC) who have progressed on prior platinum-based chemotherapy.

This study will be conducted in accordance with Good Clinical Practice (GCP) as defined by the International Council for Harmonisation (ICH) and in accordance with the ethical principles underlying European Union Directive 2001/20/EC and the United States Code of Federal Regulations, Title 21, Part 50 (21CFR50).

Primary Endpoint: The primary endpoint is progression-free survival (PFS), defined as the time from randomization to the first documented disease progression per RECIST v1.1 or death from any cause, whichever occurs first.

Inclusion Criteria:
1. Age ≥18 years at the time of informed consent
2. Histologically or cytologically confirmed diagnosis of Stage IIIB or IV NSCLC
3. Documented disease progression following prior platinum-based chemotherapy
4. ECOG performance status of 0 or 1
5. Adequate organ function as defined by laboratory values`
  },
  {
    title: "Safety Section",
    text: `Adverse Event Reporting and Safety Monitoring

An adverse event (AE) is defined as any untoward medical occurrence in a clinical trial subject administered a medicinal product, which does not necessarily have a causal relationship with the treatment. An AE can therefore be any unfavorable and unintended sign, symptom, or disease temporally associated with the use of a medicinal product.

A serious adverse event (SAE) is any AE that results in: death, is life-threatening, requires inpatient hospitalization or prolongation of existing hospitalization, results in persistent or significant disability/incapacity, is a congenital anomaly/birth defect, or is a medically important event.

All AEs must be recorded from the time of informed consent until 30 days after the last dose of study drug. SAEs must be reported to the Sponsor within 24 hours of awareness. The Investigator must assess the relationship of each AE to study drug using the following categories: not related, unlikely related, possibly related, probably related, or definitely related.`
  },
  {
    title: "ICH E3 CSR Template",
    text: `STRUCTURE AND CONTENT OF CLINICAL STUDY REPORTS

The clinical study report described in this guideline is an "integrated" full report of an individual study of any therapeutic, prophylactic or diagnostic agent conducted in patients, in which the clinical and statistical description, presentations, and analyses are integrated into a single report.

TITLE PAGE: The title page should contain the following information: study title, name of test drug/investigational product, indication studied, name of the sponsor, protocol identification, development phase of study, study initiation date, study completion date, name and affiliation of principal investigator, statement indicating compliance with Good Clinical Practices.

SYNOPSIS: A brief synopsis (usually limited to 3 pages) that summarises the study should be provided. The synopsis should include numerical data to illustrate results, not just text or p-values.

ETHICS: It should be confirmed that the study was conducted in accordance with the ethical principles that have their origins in the Declaration of Helsinki. How and when informed consent was obtained should be described.

PATIENT DISPOSITION: There should be a clear accounting of all patients who entered the study, using figures or tables. The numbers of patients randomised and who completed each phase should be provided, as well as reasons for discontinuations.

SAFETY EVALUATION: A serious adverse event is any untoward medical occurrence that at any dose results in death, is life-threatening, requires hospitalisation, or results in persistent disability.`
  }
]

// Component type colors - Extended for CSR/ICH Guidelines
const TYPE_COLORS = {
  boilerplate: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  definition: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
  study_section: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  drug_info: { bg: '#f3e8ff', border: '#a855f7', text: '#7c3aed' },
  safety: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
  procedure: { bg: '#e0e7ff', border: '#6366f1', text: '#4338ca' },
  csr_structure: { bg: '#fdf4ff', border: '#d946ef', text: '#86198f' },
  statistical: { bg: '#ecfeff', border: '#06b6d4', text: '#0e7490' },
  regulatory_guidance: { bg: '#f0fdf4', border: '#16a34a', text: '#14532d' },
  ethics: { bg: '#fffbeb', border: '#ca8a04', text: '#713f12' }
}

function App() {
  const [activeTab, setActiveTab] = useState('file') // default to file upload
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [expandedComponent, setExpandedComponent] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const fileInputRef = useRef(null)

  const identifyFromText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some clinical text to analyze')
      return
    }

    setLoading(true)
    setError(null)
    setComponents([])
    setStats(null)

    try {
      const response = await fetch(`${API_URL}/api/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to identify components')
      }

      setComponents(data.components)
      setStats({
        total: data.total_components,
        model: data.model,
        method: data.method,
        examples: data.examples_used
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const identifyFromFile = async () => {
    if (!selectedFile) {
      setError('Please select a file to analyze')
      return
    }

    setLoading(true)
    setError(null)
    setComponents([])
    setStats(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file')
      }

      setComponents(data.components)
      setStats({
        total: data.total_components,
        totalPages: data.total_pages,
        model: data.model,
        method: data.method,
        examples: data.examples_used,
        filename: data.filename,
        textLength: data.text_length,
        truncated: data.truncated
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleIdentify = () => {
    if (activeTab === 'text') {
      identifyFromText()
    } else {
      identifyFromFile()
    }
  }

  const loadSample = (sample) => {
    setInputText(sample.text)
    setActiveTab('text')
    setComponents([])
    setError(null)
    setStats(null)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (isValidFileType(file)) {
        setSelectedFile(file)
        setError(null)
      } else {
        setError('Invalid file type. Please upload PDF, DOCX, or TXT files.')
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (isValidFileType(file)) {
        setSelectedFile(file)
        setError(null)
      } else {
        setError('Invalid file type. Please upload PDF, DOCX, or TXT files.')
      }
    }
  }

  const isValidFileType = (file) => {
    const validTypes = ['.pdf', '.docx', '.txt']
    const fileName = file.name.toLowerCase()
    return validTypes.some(type => fileName.endsWith(type))
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return '#22c55e'
    if (confidence >= 0.8) return '#f59e0b'
    return '#ef4444'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const exportAllComponents = () => {
    const exportData = components.map((comp, index) => ({
      id: index + 1,
      type: comp.type,
      title: comp.title,
      text: comp.text,
      confidence: comp.confidence,
      reuse_potential: comp.reuse_potential,
      rationale: comp.rationale,
      page: comp.location?.page || 'N/A',
      section: comp.location?.section || 'N/A'
    }))
    
    const jsonStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `components_${stats?.filename || 'export'}_${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h1>Clinical Component Identifier</h1>
          </div>
          <span className="badge">Few-Shot (18 examples) • CSR/ICH E3 Ready • ~85-95% accuracy</span>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="grid">
            {/* Input Panel */}
            <div className="panel">
              <div className="panel-header">
                <h2>Input</h2>
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'text' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Text
                  </button>
                  <button 
                    className={`tab ${activeTab === 'file' ? 'active' : ''}`}
                    onClick={() => setActiveTab('file')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload File
                  </button>
                </div>
              </div>
              
              {activeTab === 'text' ? (
                <>
                  <textarea
                    className="textarea"
                    placeholder="Paste clinical protocol text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <div className="char-count-bar">
                    {inputText.length.toLocaleString()} characters
                  </div>
                  <div className="samples-section">
                    <p className="samples-label">Sample Clinical Texts ({SAMPLE_TEXTS.length} examples)</p>
                    <div className="samples-grid">
                      {SAMPLE_TEXTS.map((sample, index) => (
                        <button
                          key={index}
                          className="sample-button"
                          onClick={() => loadSample(sample)}
                        >
                          {sample.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="file-upload-section">
                  <div 
                    className={`drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    
                    {selectedFile ? (
                      <div className="selected-file">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <polyline points="9 15 11 17 15 13"></polyline>
                        </svg>
                        <p className="file-name">{selectedFile.name}</p>
                        <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                        <button 
                          className="clear-file"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFile(null)
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="drop-prompt">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p>Drag & drop a file here, or click to browse</p>
                        <p className="supported-formats">Supported: PDF, DOCX, TXT (max 16MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                className="identify-button"
                onClick={handleIdentify}
                disabled={loading || (activeTab === 'text' ? !inputText.trim() : !selectedFile)}
              >
                {loading ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="60" strokeLinecap="round" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Identify Components
                  </>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="panel results-panel">
              <div className="panel-header">
                <h2>Identified Components</h2>
                <div className="header-actions">
                  {stats && (
                    <span className="stats-badge">
                      {stats.total} found
                      {stats.totalPages && ` • ${stats.totalPages} pages`}
                      {stats.filename && ` • ${stats.filename}`}
                      {stats.truncated && ' • (truncated)'}
                    </span>
                  )}
                  {components.length > 0 && (
                    <button className="export-button" onClick={exportAllComponents}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Export JSON
                    </button>
                  )}
                </div>
              </div>

              <div className="results-container">
                {error && (
                  <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {!loading && !error && components.length === 0 && (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p>
                      {activeTab === 'text' 
                        ? 'Enter clinical text and click "Identify Components" to analyze'
                        : 'Upload a PDF, DOCX, or TXT file and click "Identify Components"'}
                    </p>
                  </div>
                )}

                {components.map((comp, index) => {
                  const colors = TYPE_COLORS[comp.type] || TYPE_COLORS.study_section
                  const isExpanded = expandedComponent === index
                  const isCopied = copiedIndex === index
                  
                  return (
                    <div
                      key={index}
                      className={`component-card ${isExpanded ? 'expanded' : ''}`}
                      style={{ 
                        backgroundColor: colors.bg,
                        borderColor: colors.border
                      }}
                    >
                      <div className="component-header">
                        <div className="header-left">
                          <span 
                            className="component-type"
                            style={{ 
                              backgroundColor: colors.border,
                              color: 'white'
                            }}
                          >
                            {comp.type.replace('_', ' ')}
                          </span>
                          {comp.location && (comp.location.page || comp.location.section) && (
                            <span className="location-badge">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {comp.location.page && `Page ${comp.location.page}`}
                              {comp.location.page && comp.location.section && ' • '}
                              {comp.location.section}
                            </span>
                          )}
                        </div>
                        <div className="header-right">
                          <span 
                            className="confidence-badge"
                            style={{ color: getConfidenceColor(comp.confidence) }}
                          >
                            {Math.round(comp.confidence * 100)}%
                          </span>
                          <button 
                            className={`copy-button ${isCopied ? 'copied' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(comp.text, index)
                            }}
                            title="Copy text"
                          >
                            {isCopied ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="component-title" style={{ color: colors.text }}>
                        {comp.title}
                      </h3>
                      
                      <div 
                        className={`component-text-container ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => setExpandedComponent(isExpanded ? null : index)}
                      >
                        <p className="component-text">
                          {comp.text}
                        </p>
                        {!isExpanded && comp.text.length > 200 && (
                          <div className="text-fade"></div>
                        )}
                      </div>
                      
                      <div className="component-meta">
                        <span className={`reuse-badge reuse-${comp.reuse_potential}`}>
                          Reuse: {comp.reuse_potential}
                        </span>
                        <span className="expand-hint" onClick={() => setExpandedComponent(isExpanded ? null : index)}>
                          {isExpanded ? '▲ Collapse' : '▼ Expand'}
                        </span>
                      </div>
                      
                      {isExpanded && comp.rationale && (
                        <div className="rationale">
                          <strong>Rationale:</strong> {comp.rationale}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Powered by OpenAI GPT-4o-mini • Few-Shot Prompting with 18 Clinical Examples • ICH E3 CSR Ready • Supports PDF, DOCX, TXT</p>
      </footer>
    </div>
  )
}

export default App
