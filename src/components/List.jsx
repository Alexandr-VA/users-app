import { useEffect, useState } from 'react';

const USERS_URL =
  'https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/users.json';

export default function List({ selectedId, onSelect }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(USERS_URL);
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="status">Загрузка списка…</div>;
  if (error) return <div className="status error">Ошибка: {error}</div>;

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li
          key={user.id}
          className={user.id === selectedId ? 'user-item active' : 'user-item'}
          onClick={() => onSelect({ id: user.id, name: user.name })}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
}