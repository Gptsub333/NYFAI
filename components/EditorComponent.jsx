"use client"

import { useEffect, useRef, useState } from "react"

// Dynamically import EditorJS and related tools only on client side
let EditorJS, Header, List, Paragraph, Quote, Delimiter, Embed

if (typeof window !== "undefined") {
    EditorJS = require("@editorjs/editorjs").default
    Header = require("@editorjs/header").default
    List = require("@editorjs/list").default
    Paragraph = require("@editorjs/paragraph").default
    Quote = require("@editorjs/quote").default
    Delimiter = require("@editorjs/delimiter").default
    Embed = require("@editorjs/embed").default

    // Suppress EditorJS console errors in iframe context
    const originalConsoleError = console.error
    console.error = (...args) => {
        const message = args.join(" ")
        if (message.includes("getLayoutMap") || message.includes("SecurityError")) {
            return
        }
        originalConsoleError.apply(console, args)
    }

    window.addEventListener("unhandledrejection", (event) => {
        if (event.reason && event.reason.message && event.reason.message.includes("getLayoutMap")) {
            event.preventDefault()
        }
    })
}

// Custom Image Tool - only define on client side
let CustomImageTool

if (typeof window !== "undefined") {
    CustomImageTool = class {
        static get toolbox() {
            return {
                title: "Image",
                icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-67 49v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
            }
        }

        constructor({ data, config, api }) {
            this.api = api
            this.config = config || {}
            this.data = data || {}
            this.wrapper = undefined
            this.settings = [
                {
                    name: "withBorder",
                    icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232H0v-2.138h2.3v-2.043h2.25z"/><path d="M6.762 7.854L3.1 3.854 5.03 1.62l3.677 4.017L12.383 1.62l1.929 2.234-3.662 4z"/></svg>',
                },
                {
                    name: "stretched",
                    icon: '<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.51l3.792 3.791a.1.1 0 0 1-.375 1.755L12.978 9.66a1.125 1.125 0 1 1-1.59-1.591l1.18-1.144z"/></svg>',
                },
                {
                    name: "withBackground",
                    icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>',
                },
            ]
        }

        render() {
            this.wrapper = document.createElement("div")
            this.wrapper.classList.add("image-tool")

            if (this.data && this.data.url) {
                this._createImage(this.data.url, this.data.caption)
                return this.wrapper
            }

            const input = document.createElement("div")
            input.innerHTML = `
          <div class="image-tool__upload-area" style="border: 2px dashed #374151; border-radius: 8px; padding: 40px; text-align: center; background: #1f2937; margin: 20px 0;">
            <div class="image-tool__upload-options" style="display: flex; gap: 20px; justify-content: center; align-items: center; flex-wrap: wrap;">
              <div class="image-tool__file-upload" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <input type="file" accept="image/*" style="display: none;" class="image-tool__file-input">
                <button type="button" class="image-tool__file-button" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                  📁 Upload File
                </button>
                <span style="color: #9ca3af; font-size: 12px;">Upload from device</span>
              </div>
              
              <div style="color: #6b7280; font-size: 14px;">OR</div>
              
              <div class="image-tool__url-upload" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <input type="url" placeholder="Paste image URL..." class="image-tool__url-input" style="background: #374151; border: 1px solid #4b5563; color: white; padding: 10px; border-radius: 6px; width: 250px; font-size: 14px;">
                <button type="button" class="image-tool__url-button" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                  🔗 Add by URL
                </button>
                <span style="color: #9ca3af; font-size: 12px;">Paste image URL</span>
              </div>
            </div>
          </div>
        `

            const fileInput = input.querySelector(".image-tool__file-input")
            const fileButton = input.querySelector(".image-tool__file-button")
            const urlInput = input.querySelector(".image-tool__url-input")
            const urlButton = input.querySelector(".image-tool__url-button")

            fileButton.addEventListener("click", () => {
                fileInput.click()
            })

            fileInput.addEventListener("change", async (e) => {
                const file = e.target.files[0]
                if (file) {
                    try {
                        // Upload to S3 via your API
                        const base64String = await this._fileToBase64(file);
                        const fileName = `article-${Date.now()}.jpg`;
                        const bucketName = "nyfai-website-image";

                        const uploadRes = await fetch("/api/upload", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
                        });

                        if (uploadRes.ok) {
                            const data = await uploadRes.json();
                            this._createImage(data.imageUrl, "");
                        } else {
                            // Fallback to preview URL if upload fails
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                this._createImage(e.target.result, "")
                            }
                            reader.readAsDataURL(file)
                        }
                    } catch (error) {
                        console.error("Upload failed, using preview:", error);
                        // Fallback to preview URL
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            this._createImage(e.target.result, "")
                        }
                        reader.readAsDataURL(file)
                    }
                }
            })

            urlButton.addEventListener("click", () => {
                const url = urlInput.value.trim()
                if (url) {
                    this._createImage(url, "")
                }
            })

            urlInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    const url = urlInput.value.trim()
                    if (url) {
                        this._createImage(url, "")
                    }
                }
            })

            this.wrapper.appendChild(input)
            return this.wrapper
        }

        _fileToBase64(file) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const base64String = e.target.result.split(",")[1];
                    resolve(base64String);
                }
                reader.readAsDataURL(file)
            })
        }

        _createImage(url, caption = "") {
            this.wrapper.innerHTML = `
          <div class="image-tool__image-container" style="position: relative; margin: 20px 0;">
            <img src="${url}" alt="" style="max-width: 100%; height: auto; border-radius: 8px; display: block;">
            <input type="text" placeholder="Add a caption..." value="${caption}" class="image-tool__caption" 
                   style="width: 100%; margin-top: 10px; padding: 8px; background: #374151; border: 1px solid #4b5563; color: white; border-radius: 4px; font-size: 14px;">
          </div>
        `

            const captionInput = this.wrapper.querySelector(".image-tool__caption")
            captionInput.addEventListener("input", (e) => {
                this.data.caption = e.target.value
            })

            this.data.url = url
            this.data.caption = caption
        }

        save() {
            return this.data
        }

        renderSettings() {
            const wrapper = document.createElement("div")

            this.settings.forEach((tune) => {
                const button = document.createElement("div")
                button.classList.add("cdx-settings-button")
                button.innerHTML = tune.icon
                wrapper.appendChild(button)

                button.addEventListener("click", () => {
                    this._toggleTune(tune.name)
                    button.classList.toggle("cdx-settings-button--active")
                })
            })

            return wrapper
        }

        _toggleTune(tune) {
            this.data[tune] = !this.data[tune]
            this._acceptTuneView()
        }

        _acceptTuneView() {
            this.settings.forEach((tune) => {
                const image = this.wrapper.querySelector("img")
                if (image) {
                    image.classList.toggle(`image-tool--${tune.name}`, !!this.data[tune.name])
                }
            })
        }
    }
}

const EditorComponent = ({ data, onChange, readOnly = false }) => {
    const ejInstance = useRef(null)
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState(null)
    const [isClient, setIsClient] = useState(false)
    const editorId = useRef(`editorjs-${Math.random().toString(36).substr(2, 9)}`)
    const isInitializing = useRef(false)
    const mountRef = useRef(false)
    const changeTimeoutRef = useRef(null)

    // Check if we're on the client side
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Debounced onChange to prevent focus loss
    const debouncedOnChange = (content) => {
        if (changeTimeoutRef.current) {
            clearTimeout(changeTimeoutRef.current)
        }

        changeTimeoutRef.current = setTimeout(() => {
            if (onChange && mountRef.current) {
                onChange(content)
            }
        }, 1000) // Increase debounce time to 1 second for better focus retention
    }

    // Cleanup function
    const cleanupEditor = async () => {
        if (ejInstance.current) {
            try {
                if (typeof ejInstance.current.destroy === 'function') {
                    await ejInstance.current.destroy()
                }
            } catch (error) {
                console.log("Editor cleanup error (non-critical):", error)
            } finally {
                ejInstance.current = null
                setIsReady(false)
            }
        }
    }

    const initEditor = async () => {
        if (isInitializing.current || !mountRef.current || !EditorJS) return

        isInitializing.current = true
        setError(null)

        try {
            // Clean up any existing editor first
            await cleanupEditor()

            const initialData = data && data.blocks && data.blocks.length > 0
                ? data
                : {
                    blocks: [
                        {
                            type: "paragraph",
                            data: {
                                text: readOnly ? "" : "Start writing your content...",
                            },
                        },
                    ],
                }

            const editor = new EditorJS({
                holder: editorId.current,
                onReady: () => {
                    if (!mountRef.current) return
                    ejInstance.current = editor
                    setIsReady(true)
                    console.log("Editor.js is ready!")
                },
                onChange: async (api, event) => {
                    if (!mountRef.current || !onChange || readOnly) return

                    try {
                        const content = await api.saver.save()
                        debouncedOnChange(content)
                    } catch (error) {
                        if (!error.message.includes("getLayoutMap")) {
                            console.error("Error saving content:", error)
                        }
                    }
                },
                readOnly: readOnly,
                data: initialData,
                tools: {
                    header: {
                        class: Header,
                        config: {
                            placeholder: "Enter a header",
                            levels: [1, 2, 3, 4],
                            defaultLevel: 2,
                        },
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                        config: {
                            placeholder: readOnly ? "" : "Start writing your content...",
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: "unordered",
                        },
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: "Enter a quote",
                            captionPlaceholder: "Quote's author",
                        },
                    },
                    delimiter: Delimiter,
                    ...(!readOnly && {
                        embed: {
                            class: Embed,
                            config: {
                                services: {
                                    youtube: true,
                                    coub: true,
                                    twitter: true,
                                    instagram: true,
                                },
                            },
                        },
                        image: {
                            class: CustomImageTool,
                        },
                    }),
                },
                logLevel: "ERROR",
                placeholder: readOnly ? "" : "Let's write an awesome story!",
                sanitizer: {
                    b: true,
                    i: true,
                    u: true,
                    s: true,
                    mark: true,
                    code: true,
                    kbd: true,
                },
            })
        } catch (error) {
            if (!error.message.includes("getLayoutMap")) {
                console.error("Error initializing Editor.js:", error)
                setError(error.message)
            }
        } finally {
            isInitializing.current = false
        }
    }

    useEffect(() => {
        if (!isClient) return

        mountRef.current = true

        const timeoutId = setTimeout(() => {
            if (mountRef.current) {
                initEditor()
            }
        }, 100)

        return () => {
            mountRef.current = false
            clearTimeout(timeoutId)
            if (changeTimeoutRef.current) {
                clearTimeout(changeTimeoutRef.current)
            }
            cleanupEditor()
        }
    }, [isClient]) // Only initialize when client-side is confirmed

    // Only render data on initial load, not during editing to prevent focus loss
    useEffect(() => {
        if (ejInstance.current && data && isReady && !readOnly && !isInitializing.current) {
            // Only render if this is truly new data (not just a re-render with same data)
            const updateData = async () => {
                try {
                    const currentData = await ejInstance.current.save()
                    // Only update if the data is significantly different
                    const dataString = JSON.stringify(data)
                    const currentString = JSON.stringify(currentData)

                    if (dataString !== currentString && (!currentData.blocks || currentData.blocks.length <= 1)) {
                        await ejInstance.current.render(data)
                    }
                } catch (error) {
                    console.log("Data update error (non-critical):", error)
                }
            }
            updateData()
        }
    }, [isReady]) // Remove data from dependencies to prevent re-rendering during typing

    // Show loading on server side or before client hydration
    if (!isClient) {
        return (
            <div className="w-full">
                <div className="text-gray-400 text-center py-8">Loading editor...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400">Editor initialization failed: {error}</p>
                <p className="text-sm text-gray-400 mt-2">
                    This might be due to iframe restrictions. Please try refreshing the page.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <style jsx global>{`
        .codex-editor {
          background: transparent !important;
        }
        
        .codex-editor__redactor {
          padding-bottom: 50px !important;
          padding-left: ${readOnly ? '0px' : '60px'} !important;
        }
        
        .ce-toolbar__plus {
          background: #4b5563 !important;
          border: 1px solid #6b7280 !important;
          color: #d1d5db !important;
          left: 0 !important;
          transform: none !important;
        }
        
        .ce-toolbar__plus:hover {
          background: #6b7280 !important;
          color: #f3f4f6 !important;
        }
        
        .ce-toolbar__settings-btn {
          background: #4b5563 !important;
          border: 1px solid #6b7280 !important;
          color: #d1d5db !important;
          left: 40px !important;
          transform: none !important;
        }
        
        .ce-toolbar__settings-btn:hover {
          background: #6b7280 !important;
          color: #f3f4f6 !important;
        }
        
        .ce-toolbar {
          left: 0 !important;
          transform: none !important;
        }
        
        .ce-popover {
          background: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4) !important;
        }
        
        .ce-popover__item {
          color: #e5e7eb !important;
        }
        
        .ce-popover__item:hover {
          background: #374151 !important;
        }
        
        .ce-popover__item-icon {
          background: #4b5563 !important;
          border-radius: 4px !important;
        }
        
        .ce-conversion-toolbar {
          background: #1f2937 !important;
          border: 1px solid #4b5563 !important;
        }
        
        .ce-conversion-tool {
          color: #e5e7eb !important;
        }
        
        .ce-conversion-tool:hover {
          background: #374151 !important;
        }
        
        .ce-inline-toolbar {
          background: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4) !important;
        }
        
        .ce-inline-tool {
          color: #d1d5db !important;
        }
        
        .ce-inline-tool:hover {
          background: #374151 !important;
          color: #f3f4f6 !important;
        }
        
        .ce-block__content {
          max-width: none !important;
        }
        
        .ce-paragraph {
          color: #e5e7eb !important;
          line-height: 1.6 !important;
        }
        
        .ce-header {
          color: #ffffff !important;
        }
        
        .ce-quote {
          border-left: 4px solid #6b7280 !important;
          background: #1f2937 !important;
          color: #d1d5db !important;
        }
        
        .ce-list {
          color: #e5e7eb !important;
        }
        
        .ce-delimiter {
          border-top: 2px solid #374151 !important;
        }

        /* Hide cursor and disable interaction in read-only mode */
        ${readOnly ? `
        .codex-editor .ce-block {
          pointer-events: none !important;
        }
        .codex-editor .ce-paragraph {
          cursor: default !important;
        }
        .codex-editor .ce-toolbar {
          display: none !important;
        }
        ` : ''}
      `}</style>

            <div
                id={editorId.current}
                className={`prose prose-invert max-w-none min-h-[300px] ${readOnly ? "pointer-events-none" : ""}`}
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
            {!isReady && !error && <div className="text-gray-400 text-center py-8">Loading editor...</div>}
        </div>
    )
}

export default EditorComponent