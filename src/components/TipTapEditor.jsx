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
        border:"1px solid #ddd",
        borderRadius:"8px",
        background:"#fff",
        padding:"10px"
      }}
    >

      <div
        style={{
          display:"flex",
          gap:"10px",
          marginBottom:"10px"
        }}
      >

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          B
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          I
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          Lista
        </button>

      </div>

      <EditorContent editor={editor} />

    </div>
  )
}