import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function TipTapEditor({
  value,
  onChange
}) {

  const editor = useEditor({

    extensions: [
      StarterKit
    ],

    content: value || "",

    immediatelyRender: false,

    onUpdate: ({ editor }) => {

      onChange(
        editor.getHTML()
      )
    }
  })

  if (!editor) return null

  return (

    <div
      style={{
        border: "1px solid #dcdcdc",
        borderRadius: "10px",
        background: "#fff",
        overflow: "hidden",
        marginBottom: "20px"
      }}
    >

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          borderBottom: "1px solid #eee",
          background: "#fafafa"
        }}
      >

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          style={{
            padding: "6px 12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          style={{
            padding: "6px 12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          style={{
            padding: "6px 12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          Lista
        </button>

      </div>

      <div
        style={{
          padding: "20px 0px 0px 40px",
          minHeight: "220px",
          lineHeight: "1.8",
          fontSize: "15px",
          color: "#333",
          fontFamily: "Arial"
        }}
      >

        <EditorContent editor={editor} />

      </div>

    </div>
  )
}