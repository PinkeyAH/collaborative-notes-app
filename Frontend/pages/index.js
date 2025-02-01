// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// export default function Home() {
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     fetchNotes();
//     socket.on('noteUpdated', fetchNotes);
//     return () => socket.off('noteUpdated');
//   }, []);

//   const fetchNotes = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.get('/api/notes', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setNotes(res.data);
//   };

//   return (
//     <div>
//       <h1>My Notes</h1>
//       {notes.map((note) => (
//         <div key={note._id}>
//           <h2>{note.title}</h2>
//           <p>{note.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// }


// // import { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import io from 'socket.io-client';

// // const socket = io('http://localhost:5000');

// // export default function Home() {
// //   const [notes, setNotes] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState('');

// //   useEffect(() => {
// //     fetchNotes();
// //     socket.on('noteUpdated', fetchNotes);
// //     return () => socket.off('noteUpdated');
// //   }, []);

// //   const fetchNotes = async () => {
// //     const token = localStorage.getItem('token');
// //     const res = await axios.get('/api/notes', {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     setNotes(res.data);
// //   };

// //   const handleSearch = async () => {
// //     const token = localStorage.getItem('token');
// //     const res = await axios.get(`/api/notes/search?query=${searchQuery}`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     setNotes(res.data);
// //   };

// //   return (
// //     <div>
// //       <h1>My Notes</h1>
// //       <input
// //         type="text"
// //         placeholder="Search notes..."
// //         value={searchQuery}
// //         onChange={(e) => setSearchQuery(e.target.value)}
// //       />
// //       <button onClick={handleSearch}>Search</button>
// //       {notes.map((note) => (
// //         <div key={note._id}>
// //           <h2>{note.title}</h2>
// //           <p>{note.content}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const socket = io('http://localhost:5000');

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
    socket.on('noteUpdated', fetchNotes);
    return () => socket.off('noteUpdated');
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/notes/search?query=${searchQuery}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setNotes(items);
  };

  return (
    <div>
      <h1>My Notes</h1>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {notes.map((note, index) => (
                <Draggable key={note._id} draggableId={note._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h2>{note.title}</h2>
                      <p>{note.content}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}