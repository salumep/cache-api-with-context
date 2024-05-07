import React from 'react';
import useFetch from '../hooks/useFetch';

// Dummy function to simulate fetching data
async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { items: ['Data 1', 'Data 2', 'Data 3'] };
}

const Test: React.FC = () => {
  const { data, isLoading, error, refetch, fromCache } = useFetch({
    queryFn: getData,
    key: 'all-items', // Can be dynamic
    cache: {
      enable: true,
      cacheTime: 50,
    },
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h2>Data:</h2>
          <ul>
            {data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <p>
        {fromCache ? 'Data fetched from cache' : 'Data fetched from server'}
      </p>
      <button onClick={() => refetch()}>Refetch Data</button>
    </div>
  );
};
export default Test;
