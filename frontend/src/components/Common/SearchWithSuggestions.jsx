import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

/**
 * SearchWithSuggestions
 *
 * Props:
 *   placeholder   string
 *   suggestions   { label, sublabel?, value }[]   — built from already-loaded data in the parent
 *   onCommit(val) — called ONLY when user presses Enter or clicks a suggestion → triggers API call
 *   onClear()     — called when box is emptied → parent resets search to show all data
 *   icon          optional MUI icon element for each suggestion row
 *   size          "small" | "medium"
 */
export default function SearchWithSuggestions({
  placeholder = 'Search...',
  suggestions = [],
  onCommit,
  onClear,
  icon,
  size = 'medium',
}) {
  const [inputValue, setInputValue]       = useState('')
  const [open, setOpen]                   = useState(false)
  const [highlightIndex, setHighlight]    = useState(-1)
  const containerRef                      = useRef(null)
  const inputRef                          = useRef(null)

  // filter suggestions against what is typed right now — purely local, no API
  const filtered = inputValue.trim() === ''
    ? []
    : suggestions
        .filter((s) => {
          const q = inputValue.toLowerCase()
          return (
            s.label.toLowerCase().includes(q) ||
            (s.sublabel && s.sublabel.toLowerCase().includes(q))
          )
        })
        .slice(0, 8)

  // close dropdown when user clicks anywhere outside this component
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setHighlight(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    setHighlight(-1)

    if (val === '') {
      setOpen(false)
      onClear()          // box cleared → show all data immediately
    } else {
      setOpen(true)      // show dropdown while typing (no API call yet)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((i) => Math.min(i + 1, filtered.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((i) => Math.max(i - 1, -1))
      return
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setHighlight(-1)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightIndex >= 0 && filtered[highlightIndex]) {
        // user navigated to a suggestion with arrow keys → select it
        commitSuggestion(filtered[highlightIndex])
      } else if (inputValue.trim() !== '') {
        // plain Enter with text typed → search whatever is in the box
        setOpen(false)
        onCommit(inputValue.trim())
      }
    }
  }

  const commitSuggestion = (suggestion) => {
    setInputValue(suggestion.label)   // keep the selected text visible in the box
    setOpen(false)
    setHighlight(-1)
    onCommit(suggestion.value ?? suggestion.label)
  }

  const handleClearBtn = () => {
    setInputValue('')
    setOpen(false)
    setHighlight(-1)
    onClear()
    inputRef.current?.focus()
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>

      {/* Search input */}
      <TextField
        inputRef={inputRef}
        fullWidth
        size={size}
        variant="outlined"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.trim() !== '' && filtered.length > 0) setOpen(true)
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClearBtn} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      {/* Dropdown — only renders when open AND there are filtered suggestions */}
      {open && filtered.length > 0 && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1400,
            mt: 0.5,
            maxWidth: '100%',
            maxHeight: 300,
            overflowY: 'auto',
            overflowX: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <List dense disablePadding>
            {filtered.map((s, i) => (
              <ListItem
                key={i}
                selected={i === highlightIndex}
                onMouseDown={(e) => e.preventDefault()}  // prevent input losing focus
                onClick={() => commitSuggestion(s)}
                sx={{
                  px: 2,
                  py: 0.75,
                  cursor: 'pointer',
                  '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'action.selected' },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {icon && (
                  <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary' }}>
                    {icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  sx={{ minWidth: 0, overflowWrap: 'break-word' }}
                  primary={<HighlightMatch text={s.label} query={inputValue} />}
                  secondary={
                    s.sublabel
                      ? <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'break-word' }}>{s.sublabel}</Typography>
                      : null
                  }
                />
              </ListItem>
            ))}
          </List>

          {/* footer hint */}
          <Box sx={{ px: 2, py: 0.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'normal' }}>
              ↑↓ navigate &nbsp;·&nbsp; Enter to select &nbsp;·&nbsp; Esc to close
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Typed something but no match in current page */}
      {open && inputValue.trim() !== '' && filtered.length === 0 && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1400,
            mt: 0.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="body2" color="text.secondary">
              No suggestions — press <strong>Enter</strong> to search
            </Typography>
          </Box>
        </Paper>
      )}

    </Box>
  )
}

// Bolds the part of the text that matches the query
function HighlightMatch({ text, query }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <Typography variant="body2">{text}</Typography>
  return (
    <Typography variant="body2" component="span">
      {text.slice(0, idx)}
      <strong>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </Typography>
  )
}