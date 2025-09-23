"use client"

import { useEffect, useRef } from "react"
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Paragraph from "@editorjs/paragraph"
import Quote from "@editorjs/quote"
import Delimiter from "@editorjs/delimiter"
import Image from "@editorjs/image"
import LinkTool from "@editorjs/link"
import Embed from "@editorjs/embed"

// Custom Image Tool for read-only rendering that matches the edit mode structure
class ReadOnlyImageTool {
    static get toolbox() {
        return {
            title: "Image",
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-67 49v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        }
    }

    // Required for read-only mode support
    static get isReadOnlySupported() {
        return true
    }

    constructor({ data, config, api, readOnly }) {
        this.data = data || {}
        this.config = config || {}
        this.api = api
        this.readOnly = readOnly
        this.wrapper = undefined
    }

    render() {
        this.wrapper = document.createElement("div")
        this.wrapper.classList.add("image-tool")

        if (this.data && this.data.url) {
            this._createImage(this.data.url, this.data.caption || "")
        } else {
            this.wrapper.innerHTML = `<div style="text-align: center; color: #666; padding: 20px;">Image not available</div>`
        }

        return this.wrapper
    }

    _createImage(url, caption = "") {
        this.wrapper.innerHTML = `
            <div class="image-tool__image-container" style="position: relative; margin: 20px 0;">
                <img src="${url}" alt="${caption}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div style="display: none; text-align: center; color: #666; padding: 20px; border: 2px dashed #ccc; border-radius: 8px;">Image failed to load</div>
                ${caption ? `<div style="text-align: center; margin-top: 8px; font-size: 14px; color: #666; font-style: italic;">${caption}</div>` : ''}
            </div>
        `
    }

    save() {
        return this.data
    }

    // Required methods for read-only support
    static get pasteConfig() {
        return {
            files: {
                mimeTypes: ['image/*'],
                fileProcessor: () => { }
            }
        }
    }

    // Disable any interactive features in read-only mode
    onPaste() {
        return
    }
}

const EditorRenderer = ({ data }) => {
    const ejInstance = useRef(null)
    const mountRef = useRef(false)
    const editorId = useRef(`editor-renderer-${Math.random().toString(36).substr(2, 9)}`)

    // Cleanup function
    const cleanupEditor = async () => {
        if (ejInstance.current) {
            try {
                if (typeof ejInstance.current.destroy === 'function') {
                    await ejInstance.current.destroy()
                }
            } catch (error) {
                console.log("Renderer cleanup error (non-critical):", error)
            } finally {
                ejInstance.current = null
            }
        }
    }

    useEffect(() => {
        mountRef.current = true

        if (data && Object.keys(data).length > 0) {
            const initRenderer = async () => {
                try {
                    // Clean up any existing editor first
                    await cleanupEditor()

                    if (!mountRef.current) return

                    const editor = new EditorJS({
                        holder: editorId.current,
                        readOnly: true,
                        data: data,
                        tools: {
                            header: Header,
                            paragraph: Paragraph,
                            list: List,
                            quote: Quote,
                            delimiter: Delimiter,
                            image: {
                                class: ReadOnlyImageTool, // Use custom image tool that matches edit mode
                            },
                            linkTool: LinkTool,
                            embed: Embed,
                        },
                        onReady: () => {
                            if (mountRef.current) {
                                ejInstance.current = editor
                            }
                        },
                    })
                } catch (error) {
                    console.error("Error initializing EditorRenderer:", error)
                }
            }

            // Small delay to ensure DOM is ready
            const timeoutId = setTimeout(initRenderer, 100)

            return () => {
                clearTimeout(timeoutId)
            }
        }

        return () => {
            mountRef.current = false
            cleanupEditor()
        }
    }, [data])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountRef.current = false
            cleanupEditor()
        }
    }, [])

    if (!data || Object.keys(data).length === 0) {
        return <div className="text-gray-400 italic">No content available</div>
    }

    return (
        <div className="w-full">
            <style jsx global>{`
                #${editorId.current} .codex-editor {
                    background: transparent !important;
                }
                
                #${editorId.current} .codex-editor__redactor {
                    padding-bottom: 20px !important;
                    padding-left: 0 !important;
                }
                
                #${editorId.current} .ce-block {
                    pointer-events: none !important;
                }
                
                #${editorId.current} .ce-paragraph {
                    cursor: default !important;
                    color: #e5e7eb !important;
                    line-height: 1.6 !important;
                }
                
                #${editorId.current} .ce-header {
                    color: #ffffff !important;
                }
                
                #${editorId.current} .ce-quote {
                    border-left: 4px solid #6b7280 !important;
                    background: #1f2937 !important;
                    color: #d1d5db !important;
                }
                
                #${editorId.current} .ce-list {
                    color: #e5e7eb !important;
                }
                
                #${editorId.current} .ce-delimiter {
                    border-top: 2px solid #374151 !important;
                }
                
                #${editorId.current} .ce-toolbar {
                    display: none !important;
                }
                
                #${editorId.current} .ce-block__content {
                    max-width: none !important;
                }

                #${editorId.current} .image-tool img {
                    border-radius: 8px !important;
                    max-width: 100% !important;
                    height: auto !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                #${editorId.current} .image-tool__image-container {
                    margin: 24px 0 !important;
                }
            `}</style>

            <div
                id={editorId.current}
                className="prose prose-invert max-w-none pointer-events-none"
                style={{
                    "--tw-prose-body": "#e5e7eb",
                    "--tw-prose-headings": "#ffffff",
                    "--tw-prose-lead": "#d1d5db",
                    "--tw-prose-links": "#3b82f6",
                    "--tw-prose-bold": "#ffffff",
                    "--tw-prose-counters": "#9ca3af",
                    "--tw-prose-bullets": "#6b7280",
                    "--tw-prose-hr": "#374151",
                    "--tw-prose-quotes": "#d1d5db",
                    "--tw-prose-quote-borders": "#374151",
                    "--tw-prose-captions": "#9ca3af",
                    "--tw-prose-code": "#e5e7eb",
                    "--tw-prose-pre-code": "#e5e7eb",
                    "--tw-prose-pre-bg": "#1f2937",
                    "--tw-prose-th-borders": "#374151",
                    "--tw-prose-td-borders": "#374151",
                }}
            />
        </div>
    )
}

export default EditorRenderer