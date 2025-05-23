"use client";

import NoteAIAgent from "./NoteAIAgent";

export default function NoteContent({ note }) {
  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          Select a note from the sidebar to view its content
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">{note.name}</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Created: {new Date(note.dateCreated).toLocaleDateString()}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Summary</h3>
        <p className="text-gray-300">{note.summary}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {note.tags &&
            note.tags.map((tag, index) => {
              if (index == 0 && tag.trim() === "")
                return (
                  <div key={index}>
                    <p className="text-gray-400 text-sm">No tags</p>
                  </div>
                );
              return (
                <span
                  key={index}
                  className=" bg-blue-900 text-blue-200 px-2 py-1 rounded-md text-sm"
                >
                  {tag}
                </span>
              );
            })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Sources</h3>
        {note.source && note.source.trim() === "" ? (
          <div>
            <p className="text-gray-400 text-sm">No sources</p>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">{note.source}</div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Content</h3>
        <div className="max-w-none text-white">{note.text}</div>
      </div>

      <NoteAIAgent note={note} />
    </div>
  );
}
