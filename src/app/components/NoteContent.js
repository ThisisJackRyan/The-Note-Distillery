'use client';

export default function NoteContent({ note }) {
  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Select a note from the sidebar to view its content
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{note.name}</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Created: {new Date(note.dateCreated).toLocaleDateString()}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p className="text-gray-700 dark:text-gray-300">{note.summary}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {note.tags && note.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sources</h3>
        <ul className="list-disc pl-5">
          {note.sources && note.sources.map((source, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">{source}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Content</h3>
        <div className="prose dark:prose-invert max-w-none">
          {note.text}
        </div>
      </div>
    </div>
  );
} 