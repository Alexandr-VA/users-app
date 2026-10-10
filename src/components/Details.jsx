import { useEffect, useState } from 'react';

const DETAILS_URL = (id) =>
  `https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/${id}.json`;

// Локальный компонент аватара — сам управляет своими состояниями загрузки
function Avatar({ src, alt }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  // при смене src (сменился пользователь) — снова "loading"
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  if (status === 'error') {
    return (
      <div className="avatar avatar-error" role="img" aria-label="Аватар недоступен">
        Невозможно загрузить аватар, ошибка на стороне сервера
      </div>
    );
  }

  return (
    <div className="avatar-wrapper">
      {status === 'loading' && (
        <div className="avatar avatar-loading" aria-label="Загрузка аватара">
          <div className="spinner" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="avatar avatar-img"
        style={{ display: status === 'loaded' ? 'block' : 'none' }}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}

export default function Details({ info }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!info?.id) return;

    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await fetch(DETAILS_URL(info.id));
        if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
        const result = await response.json();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [info?.id]);

  if (!info) return <div className="placeholder">Выберите пользователя слева</div>;
  if (loading) return <div className="status">Загрузка данных…</div>;
  if (error) return <div className="status error">Ошибка: {error}</div>;
  if (!data) return null;

  return (
    <div className="details-card">
      <Avatar src={data.avatar} alt={data.name} />
      <h3>{data.name}</h3>
      <ul className="details-list">
        <li><b>Город:</b> {data.details?.city}</li>
        <li><b>Компания:</b> {data.details?.company}</li>
        <li><b>Должность:</b> {data.details?.position}</li>
      </ul>
    </div>
  );
}