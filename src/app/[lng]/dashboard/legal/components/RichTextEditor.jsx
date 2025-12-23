'use client'

import { useRef, useEffect } from 'react'
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiList, 
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight
} from 'react-icons/fi'

export default function RichTextEditor({ value, onChange, placeholder, dir = 'ltr' }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command, value = null) => {
    editorRef.current?.focus()
    
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    
    if (command === 'insertUnorderedList') {
      const tempDiv = document.createElement('div')
      tempDiv.contentEditable = 'true'
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      document.body.appendChild(tempDiv)
      
      tempDiv.focus()
      document.execCommand('insertUnorderedList', false, null)
      
      const listHTML = tempDiv.innerHTML
      
      document.body.removeChild(tempDiv)
      
      const listNode = document.createRange().createContextualFragment(listHTML)
      range.deleteContents()
      range.insertNode(listNode)
      
      editorRef.current?.focus()
    } else {
      document.execCommand(command, false, value)
    }
    
    handleInput()
  }

  const buttons = [
    { icon: FiBold, command: 'bold', title: 'Bold' },
    { icon: FiItalic, command: 'italic', title: 'Italic' },
    { icon: FiUnderline, command: 'underline', title: 'Underline' },
    // { icon: FiList, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: FiAlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: FiAlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: FiAlignRight, command: 'justifyRight', title: 'Align Right' },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-1 flex-wrap">
        {buttons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={() => execCommand(btn.command)}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={btn.title}
          >
            <btn.icon className="w-4 h-4 text-gray-700" />
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 focus:outline-none text-gray-900"
        dir={dir}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style jsx global>{`
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        [contenteditable] ul li {
          margin: 0.25rem 0;
        }
        
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  )
}