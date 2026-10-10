import { useEffect, useState } from 'react';

const DETAILS_URL = (id) =>
  `https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/${id}.json`;

export default function Details({ info }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'loaded' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [avatarStatus, setAvatarStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  useEffect(() => {
    if (!info?.id) {
      setStatus('idle');
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);
    setData(null);              
    setAvatarStatus('loading'); 

    async function load() {
      try {
        const response = await fetch(DETAILS_URL(info.id));
        if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
        const result = await response.json();
        if (!cancelled) {
          setData(result);
          setStatus('loaded');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [info?.id]);

  if (status === 'idle') return <div className="placeholder">Выберите пользователя слева</div>;
  if (status === 'loading') return <div className="status">Загрузка данных…</div>;
  if (status === 'error') return <div className="status error">Ошибка: {error}</div>;

  return (
    <div className="details-card">
      <div className="avatar-wrapper">
        <img
          key={info.id}                                  /* пересоздаём <img> */
          src={`${data.avatar}?u=${info.id}`}            /* уникальный URL — обход кэша */
          alt={data.name}
          className="avatar avatar-img"
          onLoad={() => setAvatarStatus('loaded')}
          onError={() => setAvatarStatus('error')}
        />

        {avatarStatus === 'loading' && (
          <div className="avatar-overlay" aria-label="Загрузка аватара">
            <div className="spinner" />
          </div>
        )}

        {avatarStatus === 'error' && (
          <div className="avatar-overlay avatar-overlay-error" role="img">
            Невозможно загрузить аватар, ошибка на стороне сервера
          </div>
        )}
      </div>

      <h3>{data.name}</h3>
      <ul className="details-list">
        <li><b>Город:</b> {data.details?.city}</li>
        <li><b>Компания:</b> {data.details?.company}</li>
        <li><b>Должность:</b> {data.details?.position}</li>
      </ul>
    </div>
  );
}