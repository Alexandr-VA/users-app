import { useState } from 'react';
import List from './components/List';
import Details from './components/Details';
import './App.css';

export default function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="app">
      <div className="column">
        <h2>Пользователи</h2>
        <List selectedId={selectedUser?.id} onSelect={setSelectedUser} />
      </div>
      <div className="column">
        <h2>Детали</h2>
        <Details info={selectedUser} />
      </div>
    </div>
  );
}