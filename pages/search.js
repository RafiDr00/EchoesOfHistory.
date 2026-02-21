import React from 'react';
import Head from 'next/head';
import EnhancedSearch from '../components/EnhancedSearch';

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>Enhanced Search - Echoes of History</title>
        <meta name="description" content="Advanced historical search with AI-powered insights, live suggestions, and immersive visual results" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EnhancedSearch />
    </>
  );
}
