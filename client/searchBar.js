import React from 'react';

const searchBar = ({ query, setQuery }) => (
    <form action="/" method="get">
        <input
            name="query"
            value={query}
            onInput={clientsQuery => setQuery(clientsQuery.target.value)}
            type="text"
            placeholder="Filter The Attacks Here"
        />
        <button className='btSearch' type="submit">Filter</button>
    </form>
);
export default searchBar;
