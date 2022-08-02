import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
} from 'react-router-dom';

import { useField } from './hooks/index';

function Anecdotes({ anecdotes }) {
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Anecdote({ anecdote }) {
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see {anecdote.info}</p>
    </div>
  );
}

function Create({ anecdotes, setAnecdotes, setNotification }) {
  const navigate = useNavigate();
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');

  function generateId() {
    return Math.round(Math.random() * 1000000);
  }

  function newAnecdoteHandler(event) {
    event.preventDefault();

    const newAnecdoteObj = {
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
      id: generateId(),
    };

    setAnecdotes(anecdotes.concat(newAnecdoteObj));
    setNotification(`A new anecdote '${newAnecdoteObj.content}' created!`);
    setTimeout(() => setNotification(null), 5000);
    navigate('/');
  }

  function resetFormHandler() {
    content.reset();
    author.reset();
    info.reset();
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={newAnecdoteHandler}>
        <div>
          content
          <input {...content} reset="" />
        </div>
        <div>
          author
          <input {...author} reset="" />
        </div>
        <div>
          url for more info
          <input {...info} reset="" />
        </div>
        <button type="submit">save</button>
        <button type="button" onClick={resetFormHandler}>
          reset
        </button>
      </form>
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Notification({ message }) {
  const style = {
    border: '5px solid red',
    color: 'red',
  };

  if (message !== null) {
    return <div style={style}>{message}</div>;
  }

  return null;
}

function App() {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ]);
  const [notification, setNotification] = useState(null);
  const match = useMatch('/anecdotes/:id');
  const anecdote = match
    ? anecdotes.find((a) => a.id === Number(match.params.id))
    : null;

  return (
    <div>
      <h1>Software anecdotes</h1>

      <div>
        <Link to="/" style={{ padding: 5 }}>
          anecdotes
        </Link>
        <Link to="/create" style={{ padding: 5 }}>
          create new
        </Link>
        <Link to="/about" style={{ padding: 5 }}>
          about
        </Link>
      </div>
      <Notification message={notification} />

      <Routes>
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdote={anecdote} />}
        />
        <Route
          path="/create"
          element={
            <Create
              anecdotes={anecdotes}
              setAnecdotes={setAnecdotes}
              setNotification={setNotification}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Anecdotes anecdotes={anecdotes} />} />
      </Routes>
      <footer>
        <p>Anecdote App </p>
      </footer>
    </div>
  );
}

export default App;
